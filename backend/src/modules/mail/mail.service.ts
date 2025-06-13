// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASSWORD');

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html: string) {
    const from = this.configService.get<string>('MAIL_USER');
    const mailOptions = {
      from,
      to,
      subject,
      text,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { code: true, message: 'Email sent successfully', info };
    } catch (err) {
      console.error(err);
      return { code: false, message: 'Error sending email', info : err };
    }
  }
}
