import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StudentService } from 'src/student/student.service';
import { UserService } from 'src/user/user.service';

import { jwtConstants } from './jwt.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly studentService: StudentService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      usernameField: 'email',
    });
  }

  async validate(payload: { email: string; isStudent: boolean }) {
    if (payload.isStudent) {
      const student = await this.studentService.findOne(payload.email, {
        withRole: true,
      });
      return student;
    } else {
      const user = await this.userService.findOne(payload.email, {
        withRole: true,
      });
      return user;
    }
  }
}
