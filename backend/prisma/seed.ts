import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // atau 'bcryptjs' tergantung yang kamu install

const prisma = new PrismaClient();

async function main() {
  // 1. Kita buat hash untuk password "123456"
  const hashedPassword = await bcrypt.hash('123456', 10);

  // 2. Kita masukkan (upsert) ke database
  const admin = await prisma.user.upsert({
    where: { email: 'admin@scm.com' },
    update: {}, // Jika sudah ada, biarkan saja
    create: {
      email: 'admin@scm.com',
      name: 'Admin Master',
      role: 'ADMIN',
      password: hashedPassword,
    },
  });

  console.log('✅ Akun Admin berhasil dibuat:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });