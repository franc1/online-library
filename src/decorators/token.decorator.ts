import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithToken } from 'src/utils/token.request';

export const TokenParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as RequestWithToken;
    return request.user;
  },
);
