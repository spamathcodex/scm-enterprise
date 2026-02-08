import { PrismaClient, MvType } from '@prisma/client';
import ExcelJS from 'exceljs';

const prisma = new PrismaClient();

interface StockInput {
  warehouseId: number;
  productId: number;
  amount: number; // Jumlah barang
  type: MvType;   // IN atau OUT
  reason?: string;
  userId: number; // Siapa pelakunya?
  supplierId?: number;
  customerId?: number | null;
}

export class InventoryService {

  async processMovement(input: StockInput) {
    const { warehouseId, productId, amount, type, reason, userId, supplierId, customerId } = input;

    // KITA BUNGKUS DALAM TRANSAKSI DATABASE (ACID)
    // Jika satu langkah gagal, SEMUA DIBATALKAN.
    return await prisma.$transaction(async (tx) => {
      
      // 1. Cek Stok Saat Ini (Locking row is optional but recommended for high traffic)
      const currentStock = await tx.inventory.findUnique({
        where: { warehouseId_productId: { warehouseId, productId } }
      });

      const currentQty = currentStock?.quantity || 0;

      // 2. Validasi Stok Minus (PENTING!)
      // Jika mau KELUAR (OUT), stok harus cukup
      if (type === 'OUT') {
        if (currentQty < amount) {
          throw new Error(`Stok tidak cukup! Sisa: ${currentQty}, Diminta: ${amount}`);
        }
      }

      // 3. Hitung Perubahan (+ atau -)
      // Jika IN nambah, Jika OUT kurang
      const changeAmount = type === 'IN' ? amount : -amount;

      // 4. Update Stok Fisik (Inventory Table)
      const updatedInventory = await tx.inventory.upsert({
        where: { warehouseId_productId: { warehouseId, productId } },
        update: { quantity: { increment: changeAmount } }, // Tambah/Kurang otomatis
        create: {
          warehouseId,
          productId,
          quantity: changeAmount // Stok awal
        }
      });

      // 5. Catat Log Audit (StockMovement Table)
      // Ini bukti forensik jika ada selisih stok

      // 1. Ambil data produk untuk mendapatkan harga saat ini
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("Produk tidak ditemukan");

      // 2. Tentukan harga yang digunakan
      // Jika IN (Masuk), pakai costPrice. Jika OUT (Keluar), pakai sellingPrice.
      const currentPrice = type === 'IN' ? Number(product.costPrice) : Number(product.sellingPrice);

      const movementLog = await tx.stockMovement.create({
        data: {
          warehouseId,
          productId,
          amount: amount, // Catat angka positifnya
          type: type,
          priceAtTime: currentPrice,
          reason: reason || '-',
          userId: userId, // Pelaku dicatat disini
          supplierId: type === 'IN' ? supplierId : null,
          customerId: type === 'OUT' ? customerId : null
        }
      });

      return {
        inventory: updatedInventory,
        log: movementLog
      };
    });
  }
  
  // Fitur Cek Stok Per Gudang
  async getStockByWarehouse(warehouseId: number) {
    return prisma.inventory.findMany({
      where: { warehouseId },
      include: { product: true } // Join ke tabel produk biar ada namanya
    });
  }

  async getDashboardStats() {
    // 1. Hitung total produk
    const totalProducts = await prisma.product.count();
    
    // 2. Ambil SEMUA inventory dulu (beserta data produknya)
    const allInventory = await prisma.inventory.findMany({
      include: {
        product: true,
        warehouse: true
      }
    });

    const allMovements = await prisma.stockMovement.findMany();

    // 3. Hitung Nilai Aset (Inventory Value)
    // Rumus: Jumlah Stok * Harga Modal (costPrice)
      const inventoryValue = allInventory.reduce((acc, item) => {
      // Pastikan konversi ke Number agar aman
      const price = item.product ? Number(item.product.costPrice) : 0;
      return acc + (item.quantity * price);
    }, 0);

    // 4. Hitung Total Penjualan (Total Sales)
    // Rumus: Barang Keluar * Harga Saat Itu (priceAtTime)
    const totalSales = allMovements
      .filter(m => m.type === 'OUT')
      .reduce((acc, m) => {
        return acc + (m.amount * Number(m.priceAtTime));
      }, 0);

    
    const lowStockItems = allInventory.filter(item => {
      // Pastikan produknya ada (jaga-jaga), lalu bandingkan
      if (item.product) {
        return item.quantity <= item.product.minStock;
      }
      return false;
    });

    return {
      totalProducts,
      lowStockCount: lowStockItems.length,
      inventoryValue,
      totalSales,
      lowStockItems
    };
  }

  async transferStock(data: {
    fromWarehouseId: number;
    toWarehouseId: number;
    productId: number;
    amount: number;
    userId: number;
  }) {
    const { fromWarehouseId, toWarehouseId, productId, amount, userId } = data;

    return await prisma.$transaction(async (tx) => {
      // 1. PROSES KELUAR DARI GUDANG ASAL
      const sourceStock = await tx.inventory.findUnique({
        where: { warehouseId_productId: { warehouseId: fromWarehouseId, productId } }
      });

      if (!sourceStock || sourceStock.quantity < amount) {
        throw new Error("Stok di gudang asal tidak cukup untuk transfer");
      }

      // Kurangi stok asal
      await tx.inventory.update({
        where: { warehouseId_productId: { warehouseId: fromWarehouseId, productId } },
        data: { quantity: { decrement: amount } }
      });

      // Catat log OUT untuk gudang asal
      await tx.stockMovement.create({
        data: {
          warehouseId: fromWarehouseId,
          productId,
          amount,
          type: 'OUT',
          reason: `Transfer ke Gudang ID: ${toWarehouseId}`,
          userId,
          supplierId: null // <--- PERBAIKAN: Set null karena ini internal transfer
        }
      });

      // 2. PROSES MASUK KE GUDANG TUJUAN
      await tx.inventory.upsert({
        where: { warehouseId_productId: { warehouseId: toWarehouseId, productId } },
        update: { quantity: { increment: amount } },
        create: { warehouseId: toWarehouseId, productId, quantity: amount }
      });

      // Catat log IN untuk gudang tujuan
      await tx.stockMovement.create({
        data: {
          warehouseId: toWarehouseId,
          productId,
          amount,
          type: 'IN',
          reason: `Terima dari Gudang ID: ${fromWarehouseId}`,
          userId,
          supplierId: null // <--- PERBAIKAN: Set null juga disini
        }
      });

      return { message: "Transfer antar gudang berhasil" };
    });
  }

  // FUNGSI BARU: Generate Excel
  async exportStockMovements() {
    // 1. Ambil data dari database (Join ke Produk, Gudang, & User)
    const movements = await prisma.stockMovement.findMany({
      include: {
        product: true,
        warehouse: true,
        user: true
      },
      orderBy: { createdAt: 'desc' } // Urutkan dari yang terbaru
    });

    // 2. Buat Workbook (Buku Kerja Excel)
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Laporan Mutasi Stok');

    // 3. Bikin Judul Kolom (Header)
    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Tanggal', key: 'date', width: 20 },
      { header: 'Produk', key: 'product', width: 30 },
      { header: 'Gudang', key: 'warehouse', width: 25 },
      { header: 'Tipe', key: 'type', width: 10 },
      { header: 'Jumlah', key: 'amount', width: 15 },
      { header: 'Petugas', key: 'user', width: 20 },
      { header: 'Catatan', key: 'reason', width: 30 },
    ];

    // 4. Isi Baris Data
    movements.forEach(m => {
      sheet.addRow({
        id: m.id,
        date: m.createdAt.toISOString().split('T')[0], // Ambil tanggal saja
        product: m.product.name,
        warehouse: m.warehouse.name,
        type: m.type,
        amount: m.amount,
        user: m.user.name,
        reason: m.reason
      });
    });

    // 5. Kembalikan workbook-nya
    return workbook;
  }

  async getAllMovements() {
    return prisma.stockMovement.findMany({
      include: {
        product: true,
        warehouse: true,
        user: true,
        supplier: true, // Sertakan data Supplier
        customer: true  // Sertakan data Customer
      },
      orderBy: { createdAt: 'desc' } // Urutkan dari yang terbaru
    });
  }
}