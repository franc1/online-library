import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { RoleEnum } from 'src/role/models/role.model';
import { ApiError } from 'src/shared/api-error';
import { ErrorCodes } from 'src/shared/error-codes';
import { Token } from 'src/shared/token.request';
import { Student } from 'src/student/model/student.model';

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
      throw new ApiError(400, ErrorCodes.INVALID_EMAIL_OR_PASSWORD);
    }

    return new Token(
      userOrStudent.id,
      userOrStudent.role?.name as RoleEnum,
      userOrStudent instanceof Student,
    );
  }
}
