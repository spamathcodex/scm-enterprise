import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer.service';

const customerService = new CustomerService();

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await customerService.getAll();
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await customerService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
};