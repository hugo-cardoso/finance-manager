import { Module } from "@nestjs/common";
import { PrismaService } from "@src/common/database/prisma.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  imports: [],
})
export class UsersModule {}
