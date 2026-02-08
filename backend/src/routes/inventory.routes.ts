import { Router } from 'express';
import { createWarehouse, recordMovement, getWarehouseStock, getStats, transferStock, exportReport, getWarehouses, getMovements } from '../controllers/inventory.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// --- CCTV: CEK APAKAH FILE INI DILOAD ---
console.log("📦 [DEBUG] Inventory Routes berhasil dimuat!");

router.use(protect); 

router.get('/warehouses', getWarehouses);

// Gudang
router.post('/warehouses', authorize('ADMIN', 'MANAGER'), createWarehouse);

router.get('/movements', authorize('ADMIN', 'MANAGER'), getMovements);

// Mutasi
router.post('/movements', authorize('ADMIN', 'STAFF', 'WAREHOUSE_KEEPER'), recordMovement);

// Cek Stok
router.get('/warehouses/:id/stocks', getWarehouseStock);

// Ambil statistik & alert stok menipis
router.get('/dashboard/stats', authorize('ADMIN', 'MANAGER'), getStats);

// Transfer antar gudang
router.post('/transfer', authorize('ADMIN', 'MANAGER'), transferStock);

// Rute Download Excel (Taruh SEBELUM rute /:id dynamic biar tidak bentrok)
router.get('/export', authorize('ADMIN', 'MANAGER'), exportReport);

export default router;