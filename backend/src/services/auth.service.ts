import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { z } from 'zod';

const prisma = new PrismaClient();

export class AuthService {
  
  // 1. Logika Register
  async register(data: z.infer<typeof registerSchema>) {
    // Validasi input
    const validatedData = registerSchema.parse(data);

    // Cek apakah email sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      throw new Error("Email sudah terdaftar");
    }

    // Hash Password (Enkripsi satu arah)
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Simpan ke Database
    const newUser = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        role: validatedData.role || "STAFF" // Default role
      }
    });

    // Kembalikan user tanpa password (PENTING!)
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // 2. Logika Login
  async login(data: z.infer<typeof loginSchema>) {
    const { email, password } = loginSchema.parse(data);

    // Cari user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Email atau password salah");
    }

    // Cek kecocokan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Email atau password salah");
    }

    // Generate Token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' } // Token berlaku 1 hari
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}