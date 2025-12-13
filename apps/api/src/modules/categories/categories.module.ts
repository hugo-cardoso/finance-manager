import { Module } from "@nestjs/common";
import { PrismaService } from "@src/common/database/prisma.service";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { CategoryMapper } from "./mapper/category.mapper";

@Module({
  controllers: [CategoriesController],
  providers: [PrismaService, CategoriesService, CategoryMapper],
  exports: [CategoriesService, CategoryMapper],
})
export class CategoriesModule {}
