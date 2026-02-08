import { Router } from 'express';
import { createSupplier, getSuppliers } from '../controllers/supplier.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();
router.use(protect);

router.get('/', getSuppliers);
router.post('/', authorize('ADMIN', 'MANAGER'), createSupplier);

export default router;