import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Student } from 'src/student/model/student.model';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendStudentRegistrationCode(
    student: Student,
    registartionCode: string,
  ): Promise<void> {
    const subject = 'Complete registration';
    const template = './registration';
    const context = {
      name: `${student.firstName} ${student.lastName}`,
      code: registartionCode,
    };

    await this.sendMail(student.email, subject, template, context);
  }

  async sendMail(
    to: string,
    subject: string,
    template: string,
    context: any,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      template, // `.hbs` extension is appended automatically
      context,
    });
  }
}
