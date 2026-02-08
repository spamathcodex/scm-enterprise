import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SupplierService {
  async create(data: any) {
    return prisma.supplier.create({ data });
  }

  async getAll() {
    return prisma.supplier.findMany({ orderBy: { id: 'desc' } });
  }
}