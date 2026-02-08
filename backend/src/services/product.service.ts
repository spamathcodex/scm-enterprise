import { PrismaClient } from '@prisma/client';
import { createProductSchema } from '../schemas/product.schema';
import { z } from 'zod';

const prisma = new PrismaClient();

export class ProductService {
  
  // 1. Tambah Produk Baru
  async createProduct(data: z.infer<typeof createProductSchema>) {
    // Validasi format
    const validated = createProductSchema.parse(data);

    // Cek duplikasi SKU
    const existing = await prisma.product.findUnique({
      where: { sku: validated.sku }
    });

    if (existing) {
      throw new Error(`Produk dengan SKU ${validated.sku} sudah ada!`);
    }

    return prisma.product.create({ data: validated });
  }

  // 2. Ambil Semua Produk (DENGAN PAGINATION)
  // page = halaman ke berapa, limit = berapa data per halaman
  async getAllProducts(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        skip: skip,
        take: limit,
        orderBy: { id: 'desc' } // Produk baru di paling atas
      }),
      prisma.product.count() // Hitung total semua data
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit)
      }
    };
  }
}