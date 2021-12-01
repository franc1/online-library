import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RoleEnum } from 'src/models/role.model';
import { StudentService } from 'src/student/student.service';
import { UserService } from 'src/user/user.service';
import { Token } from 'src/utils/token.request';

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
      usernameField: 'id',
    });
  }

  async validate(payload: { id: number; isStudent: boolean }) {
    if (payload.isStudent) {
      const student = await this.studentService.findOne(
        { id: payload.id },
        {
          withRole: true,
        },
      );
      return new Token(student.id, student.role?.name as RoleEnum, true);
    } else {
      const user = await this.userService.findOne(
        { id: payload.id },
        {
          withRole: true,
        },
      );
      return new Token(user.id, user.role?.name as RoleEnum, false);
    }
  }
}
