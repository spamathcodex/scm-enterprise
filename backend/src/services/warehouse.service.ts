import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WarehouseService {
  
  // 1. Buat Gudang Baru
  async createWarehouse(code: string, name: string, location: string) {
    // Cek duplikat kode gudang
    const existing = await prisma.warehouse.findUnique({ where: { code } });
    if (existing) throw new Error(`Gudang dengan kode ${code} sudah ada!`);

    return prisma.warehouse.create({
      data: { code, name, location }
    });
  }

  // 2. Lihat Semua Gudang
  async getAllWarehouses() {
    return prisma.warehouse.findMany();
  }
}