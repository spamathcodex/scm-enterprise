import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class CustomerService {
  async create(data: any) {
    return prisma.customer.create({ data });
  }
  async getAll() {
    return prisma.customer.findMany({ orderBy: { id: 'desc' } });
  }
}