// src/repositories/inventory.repository.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class InventoryRepository {
  // Mencari stok spesifik
  async findStock(warehouseId: number, productId: number) {
    return prisma.inventory.findUnique({
      where: { warehouseId_productId: { warehouseId, productId } }
    });
  }

  // Update stok (Atomik & Aman)
  async updateStock(warehouseId: number, productId: number, amount: number) {
    return prisma.inventory.upsert({
      where: { warehouseId_productId: { warehouseId, productId } },
      update: { quantity: { increment: amount } },
      create: { warehouseId, productId, quantity: amount }
    });
  }
  
  // Catat Log (Audit Trail)
  async createLog(data: any) {
    return prisma.stockMovement.create({ data });
  }
}