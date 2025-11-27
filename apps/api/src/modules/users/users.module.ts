import { Module } from "@nestjs/common";
import { PrismaService } from "@src/common/database/prisma.service";
import { AuthGuard } from "@src/modules/auth/auth.guard";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthGuard, PrismaService],
  imports: [],
})
export class UsersModule {}
