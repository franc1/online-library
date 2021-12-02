import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public-route.decorator';
import { TokenParam } from 'src/decorators/token.decorator';
import { ErrorResponse } from 'src/shared/error.response';
import { Token } from 'src/shared/token.request';

import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { LoginResponseDTO } from './dto/login.response.dto';
import { LocalAuthGuard } from './passport-strategies/local/local-auth.guard';

@Controller('auth')
@ApiTags('auth')
@ApiBadRequestResponse({
  type: ErrorResponse,
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() login: LoginDTO,
    @TokenParam() token: Token,
  ): Promise<LoginResponseDTO> {
    return this.authService.login(token);
  }
}
