import { Router } from 'express';
import { createCustomer, getCustomers } from '../controllers/customer.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();
router.use(protect);

router.get('/', getCustomers);
router.post('/', authorize('ADMIN', 'MANAGER'), createCustomer);

export default router;