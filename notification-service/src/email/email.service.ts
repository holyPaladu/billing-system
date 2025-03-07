import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Настройка SMTP сервера
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Можете использовать любой другой SMTP-сервер
      auth: {
        user: process.env.EMAIL_USER, // ваш email
        pass: process.env.EMAIL_PASS, // ваш пароль от почты или app password
      },
    });
  }

  // Метод для отправки письма
  async sendVerificationEmail(to: string, code: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER, // ваш email
      to,
      subject: 'Registration Verification Code',
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f7fa;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              h1 {
                font-size: 24px;
                color: #333;
                text-align: center;
              }
              p {
                font-size: 16px;
                color: #555;
                line-height: 1.5;
                text-align: center;
              }
              .code {
                font-size: 20px;
                font-weight: bold;
                color: #4CAF50;
                margin: 10px 0;
                text-align: center;
              }
              .footer {
                text-align: center;
                font-size: 14px;
                color: #888;
                margin-top: 30px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Registration Verification</h1>
              <p>Your verification code is:</p>
              <div class="code">${code}</div>
              <p>Thank you for registering with us! Please use this code to complete your registration.</p>
              <div class="footer">If you did not request this, please ignore this email.</div>
            </div>
          </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
