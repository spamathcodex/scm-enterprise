import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z.string().min(3, "SKU minimal 3 karakter").max(20),
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  description: z.string().optional(),
  price: z.number().min(1, "Harga tidak boleh nol/negatif"),
  minStock: z.number().int().min(0).default(5) // Alert jika stok < 5
});

// Schema untuk update (semua field jadi optional)
export const updateProductSchema = createProductSchema.partial();