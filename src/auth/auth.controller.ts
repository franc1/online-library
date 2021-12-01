import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public-route.decorator';
import { DMSRequest } from 'src/utils/dms.request';

import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { LoginResponseDTO } from './dto/login.response.dto';
import { LocalAuthGuard } from './passport-strategies/local/local-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: DMSRequest,
    @Body() login: LoginDTO,
  ): Promise<LoginResponseDTO> {
    return this.authService.login(req.user);
  }
}
