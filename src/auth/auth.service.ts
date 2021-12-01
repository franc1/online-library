import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Student } from 'src/models/student.model';
import { User } from 'src/models/user.model';
import { StudentService } from 'src/student/student.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private studentService: StudentService,
    private jwtService: JwtService,
  ) {}

  async validateUserOrStudent(
    username: string,
    password: string,
    isStudent: boolean,
  ): Promise<User | Student> {
    if (isStudent) {
      const student = await this.studentService.findOne(
        { email: username },
        {
          withPassword: true,
          withRole: true,
        },
      );
      if (!student) {
        return null;
      }

      const validPassword = await bcrypt.compare(password, student.password);
      if (!validPassword) {
        return null;
      }

      delete student.password;
      return student;
    } else {
      const user = await this.userService.findOne(
        { email: username },
        {
          withPassword: true,
          withRole: true,
        },
      );
      if (!user) {
        return null;
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return null;
      }

      delete user.password;
      return user;
    }
  }

  async login(userOrStudent: User | Student) {
    const payload = {
      id: userOrStudent.id,
      isStudent: userOrStudent instanceof Student,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
