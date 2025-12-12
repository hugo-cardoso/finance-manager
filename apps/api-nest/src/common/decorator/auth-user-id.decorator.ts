import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export const AuthUserId = createParamDecorator<undefined>((_data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const userId = request.userId;

  if (!userId) {
    throw new UnauthorizedException();
  }

  return userId;
});
