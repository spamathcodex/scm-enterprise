import { z } from 'zod';

// Schema untuk Register
export const registerSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  // Optional: Role bisa diisi admin saat development, nanti kita kunci
  role: z.enum(["ADMIN", "MANAGER", "STAFF", "WAREHOUSE_KEEPER"]).optional()
});

// Schema untuk Login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});