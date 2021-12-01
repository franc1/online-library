import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(
    req: Request,
    username: string,
    password: string,
  ): Promise<any> {
    const isStudent = !!(req.body as any).isStudent;
    const userOrStudent = await this.authService.validateUserOrStudent(
      username,
      password,
      isStudent,
    );
    if (!userOrStudent) {
      throw new UnauthorizedException();
    }

    return userOrStudent;
  }
}
