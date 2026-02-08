import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Kita definisikan tipe data untuk Request yang sudah ditempel user
// Supaya TypeScript tidak marah
export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // 1. Cek apakah ada token di Header (Authorization: Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ambil tokennya saja (buang kata 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // 2. Verifikasi Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

      // 3. Cek apakah user pemilik token masih ada di database?
      // (Siapa tau baru aja dipecat/dihapus admin)
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, role: true } // Ambil secukupnya saja
      });

      if (!user) {
        return res.status(401).json({ success: false, message: "User tidak ditemukan" });
      }

      // 4. Tempelkan data user ke request
      req.user = user;
      next(); // Lanjut ke controller berikutnya

    } catch (error) {
      return res.status(401).json({ success: false, message: "Token tidak valid, silakan login lagi" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Akses ditolak, tidak ada token" });
  }
};

// Middleware khusus untuk membatasi Role (misal: Cuma Admin yang boleh)
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role ${req.user?.role} tidak memiliki akses ke fitur ini` 
      });
    }
    next();
  };
};