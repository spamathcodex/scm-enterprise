import { Request, Response, NextFunction } from 'express';
import { SupplierService } from '../services/supplier.service';

const supplierService = new SupplierService();

export const getSuppliers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await supplierService.getAll();
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

export const createSupplier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await supplierService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
};