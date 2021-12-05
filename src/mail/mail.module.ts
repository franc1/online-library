import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import * as config from 'config';
import { join } from 'path';

import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: config.get('mailHost'),
        secure: false,
        auth: {
          user: config.get('mailUser'),
          pass: config.get('mailPassword'),
        },
      },
      defaults: {
        from: `"No Reply" <${config.get('mailFrom')}>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
