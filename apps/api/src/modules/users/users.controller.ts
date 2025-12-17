import { Body, Controller, Get, NotFoundException, Patch, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthUserId } from "@src/common/decorator/auth-user-id.decorator";
import { JwtAuthGuard } from "@src/modules/auth/guards/jwt-auth.guard";

import { UpdateUserDto } from "./dto/update-user.dto";
import { UserCacheService } from "./user.cache.service";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userCacheService: UserCacheService,
  ) {}

  @Get("me")
  async getMe(@AuthUserId() userId: string) {
    const cachedUser = await this.userCacheService.getUser(userId);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const response = user.toJSON();

    await this.userCacheService.setUser(userId, response);

    return response;
  }

  @Patch("me")
  async updateMe(@AuthUserId() userId: string, @Body(new ValidationPipe()) updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(userId, updateUserDto);

    const response = updatedUser.toJSON();

    await this.userCacheService.setUser(userId, response);

    return response;
  }
}
