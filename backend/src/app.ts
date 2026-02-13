import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes'; // <--- Kita pasang lagi kabelnya
import productRoutes from './routes/product.routes';
import inventoryRoutes from './routes/inventory.routes';
import supplierRoutes from './routes/supplier.routes';
import customerRoutes from './routes/customer.routes';

const app: Application = express();

// 1. Middleware Standar
app.use(helmet());
app.use(cors({
  // origin: 'http://localhost:5173', // Izin khusus untuk frontend kita
  origin: 'https://scm-enterprise.vercel.app', // Izin khusus untuk frontend kita
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

// 2. Health Check (Bukti Server Hidup)
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'SCM Enterprise System is Running on Port 4000!',
    timestamp: new Date().toISOString()
  });
});

// 3. PASANG RUTE AUTH (Jantung Sistem)
// Semua yang diawali /api/auth akan masuk ke authRoutes
console.log("🔌 Memasang jalur Auth...");
app.use('/api/auth', authRoutes); 

app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/customers', customerRoutes);

// 4. Error Handler (Jaring Pengaman)
app.use(errorHandler);

export default app;