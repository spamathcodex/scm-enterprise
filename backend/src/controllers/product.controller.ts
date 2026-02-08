import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: "Produk berhasil dibuat",
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ambil query param ?page=1&limit=10 dari URL
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await productService.getAllProducts(page, limit);
    
    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};