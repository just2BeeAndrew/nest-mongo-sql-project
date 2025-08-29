import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './application/email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'andrew.dudal.1997@gmail.com',
          pass: 'bwxyzxbcfadxrmml',
        },
      },
      defaults: {
        from: '"Just2BeeAndrew" andrew.dudal.1997@gmail.com',
      }
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class NotificationsModule {}
