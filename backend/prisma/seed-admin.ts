import 'dotenv/config';
import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 8) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (minimum 12 characters)');
  }
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: UserRole.ADMIN, password: await bcrypt.hash(password, 12) },
    create: {
      email,
      password: await bcrypt.hash(password, 12),
      fullName: process.env.ADMIN_FULL_NAME ?? 'System Administrator',
      role: UserRole.ADMIN,
    },
  });
  console.log(`Admin ready: ${user.email}`);
}

main().finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});
