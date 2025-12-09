import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "./users.service";
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";


@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService], // needed so AuthModule can inject UsersService
})
export class UsersModule {}