import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmationEmail(email: string, confirmationCode: string) {
    const message = `
      <h1>Thanks for registration</h1>
      <p>To finish registration please follow the link below:</p>
      <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>ЖМАК!!!</a>
      <p>Complete registration</p>
    `;

    await this.sendEmail(email, 'Email confirmation', message);
  }

  async sendRecoveryPasswordEmail(email: string, recoveryCode: string) {
    const message = `
     <h1> Password recovery</h1>
     <p>to reset your password please follow the link bellow:</p>
     <a href = 'https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>ЖМАК!!!</a>
     <p>complete recovery></p>
    `;

    await this.sendEmail(email, "Password recovery", message);
  }

  async sendEmail(to: string, subject: string, html: string) {
    await this.mailerService.sendMail({
      to,
      subject,
      html,
    });
  }
}
