import { Module } from "@nestjs/common";
import { PrismaService } from "@src/common/database/prisma.service";
import { UserCacheService } from "./user.cache.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UserCacheService],
  imports: [],
})
export class UsersModule {}
