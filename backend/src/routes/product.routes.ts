import { Router } from 'express';
import { createProduct, getProducts } from '../controllers/product.controller';
import { protect, authorize } from '../middlewares/auth.middleware'; // Import Satpam

const router = Router();

// Semua rute di bawah ini butuh Token (Login dulu)
router.use(protect); 

// GET /api/products -> Boleh semua role
router.get('/', getProducts);

// POST /api/products -> Cuma Admin & Manager
router.post('/', authorize('ADMIN', 'MANAGER'), createProduct);

export default router;