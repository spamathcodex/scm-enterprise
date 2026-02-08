import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: user
    });
  } catch (error) {
    next(error); // Lempar ke Global Error Handler
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: any, res: Response) => {
  // req.user ini didapat dari middleware 'protect' tadi
  res.status(200).json({
    success: true,
    data: req.user,
    message: "Ini data profil anda dari Token!"
  });
};