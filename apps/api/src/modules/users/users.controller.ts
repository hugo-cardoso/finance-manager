import { Body, Controller, Get, NotFoundException, Patch, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthUserId } from "@src/common/decorator/auth-user-id.decorator";
import { JwtAuthGuard } from "@src/modules/auth/guards/jwt-auth.guard";

import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  async getMe(@AuthUserId() userId: string) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user.toJSON();
  }

  @Patch("me")
  async updateMe(@AuthUserId() userId: string, @Body(new ValidationPipe()) updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(userId, updateUserDto);

    return updatedUser.toJSON();
  }
}
