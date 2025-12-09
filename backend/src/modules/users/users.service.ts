import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { CreateUserDto, UpdateUserDto }
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    // const total = await this.prisma.user.count({
    //   where: {
    //     /* optional soft-delete filter */
    //   },
    // });

    // const users = await this.prisma.user.findMany({
    //   skip: (page - 1) * limit,
    //   take: limit,
    //   omit: { password: true },
    // });
    const users = await this.prisma.user.findMany({
      // skip: (page - 1) * limit,
      // take: limit,
      omit: { password: true },
    });

    return {
      data: users,
      // meta: { total, page, limit },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id },
      omit: { password: true },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: CreateUserDto) {
    const hashed = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
      },
      omit: { password: true },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
      omit: { password: true },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    // used by AuthService for login validation
    return this.prisma.user.findUnique({ where: { email } });
  }
}
