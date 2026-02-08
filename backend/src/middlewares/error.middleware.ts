import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  
  // Catat error ke file log lewat logger kita
  logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Tampilkan stack trace hanya saat development agar mudah debug
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};