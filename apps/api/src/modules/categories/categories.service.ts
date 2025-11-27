import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@src/common/database/prisma.service";
import { Category } from "./entities/category.entity";
import { CategoryMapper } from "./mapper/category.mapper";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryMapper: CategoryMapper,
  ) {}

  async findAll() {
    const categories = await this.prisma.category.findMany();

    return categories.map(this.categoryMapper.toEntity);
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return Category.create({
      id: category.id,
      name: category.name,
      icon: category.icon,
      type: category.type,
    });
  }

  async findManyById(ids: string[]) {
    const categories = await this.prisma.category.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return categories.map(this.categoryMapper.toEntity);
  }
}
