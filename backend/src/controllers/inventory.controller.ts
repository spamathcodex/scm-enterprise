import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import { WarehouseService } from '../services/warehouse.service';
import { AuthRequest } from '../middlewares/auth.middleware'; // Import interface custom kita

const inventoryService = new InventoryService();
const warehouseService = new WarehouseService();

// --- WAREHOUSE ---
export const createWarehouse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, name, location } = req.body;
    const result = await warehouseService.createWarehouse(code, name, location);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

// --- STOK OPNAME / MUTASI ---
export const recordMovement = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { warehouseId, productId, amount, type, reason, supplierId, customerId } = req.body;
    
    // Ambil ID User dari Token (middleware)
    const userId = req.user?.id; 

    if (!userId) throw new Error("User ID tidak ditemukan");

    const result = await inventoryService.processMovement({
      warehouseId, productId, amount, type, reason, userId, supplierId, customerId
    });

    res.status(200).json({
      success: true,
      message: `Berhasil melakukan ${type} stok`,
      data: result
    });
  } catch (error) { next(error); }
};

export const getWarehouseStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const stocks = await inventoryService.getStockByWarehouse(Number(id));
    res.status(200).json({ success: true, data: stocks });
  } catch (error) { next(error); }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await inventoryService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

export const transferStock = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { fromWarehouseId, toWarehouseId, productId, amount } = req.body;
    const userId = req.user?.id!;

    const result = await inventoryService.transferStock({
      fromWarehouseId, toWarehouseId, productId, amount, userId
    });

    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const exportReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workbook = await inventoryService.exportStockMovements();

    // Set Header supaya browser tahu ini file Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Laporan-Stok.xlsx');

    // Tulis langsung ke response (stream)
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) { next(error); }
};

export const getWarehouses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const warehouses = await warehouseService.getAllWarehouses();
    res.status(200).json({ success: true, data: warehouses });
  } catch (error) { next(error); }
};

export const getMovements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movements = await inventoryService.getAllMovements();
    res.status(200).json({ success: true, data: movements });
  } catch (error) { next(error); }
};