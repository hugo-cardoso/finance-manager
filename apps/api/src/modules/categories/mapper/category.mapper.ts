import { Injectable } from "@nestjs/common";
import type { Category as PrismaCategory } from "@src/generated/prisma/client";
import { Category } from "../entities/category.entity";

export type { Category as PrismaCategory } from "@src/generated/prisma/client";

@Injectable()
export class CategoryMapper {
  toEntity(category: PrismaCategory): Category {
    return Category.create({
      id: category.id,
      name: category.name,
      icon: category.icon,
      type: category.type,
    });
  }
}
