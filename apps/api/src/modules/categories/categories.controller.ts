import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@src/modules/auth/guards/jwt-auth.guard";
import { CategoriesService } from "./categories.service";

@Controller("categories")
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();

    return categories.map((category) => {
      return {
        id: category.id,
        name: category.name,
        icon: category.icon,
        type: category.type,
      };
    });
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const category = await this.categoriesService.findOne(id);

    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      type: category.type,
    };
  }
}
