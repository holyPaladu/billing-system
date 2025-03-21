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

  async sendReminder(
    id: number,
    to: string,
    product: { price: number; plan: string; name: string; is_active: boolean },
  ) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: `Reminder about payment id: ${id}`,
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
              .amount {
                font-size: 20px;
                font-weight: bold;
                color: #E74C3C;
                margin: 10px 0;
                text-align: center;
              }
              .footer {
                text-align: center;
                font-size: 14px;
                color: #888;
                margin-top: 30px;
              }
              .button {
                display: block;
                width: 200px;
                margin: 20px auto;
                padding: 10px;
                text-align: center;
                background-color: #3498DB;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Upcoming Subscription Payment [Product name: ${product.name}]</h1>
              <p>Dear Customer,</p>
              <p>This is a friendly reminder that your subscription payment of <span class="amount">${product.price}</span> will be charged in 2 days.</p>
              <p>If you want to manage your subscription, click the button below:</p>
              <a href="https://yourwebsite.com/manage-subscription" class="button">Manage Subscription</a>
              <p>Thank you for being with us!</p>
              <div class="footer">If you have any questions, please contact our support team.</div>
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

  async sendPayingStatus(data: { payment: any; user: any }) {
    const { payment, user } = data;
    const isSuccess = payment.status === 'success';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: isSuccess ? '✅ Оплата прошла успешно' : '❌ Ошибка платежа',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border-radius: 8px; ${
          isSuccess
            ? 'background: #e6ffed; color: #2e7d32;'
            : 'background: #ffebee; color: #c62828;'
        }">
          <h2 style="text-align: center;">${isSuccess ? '✅ Оплата успешно завершена' : '❌ Ошибка платежа'}</h2>
          <p>Здравствуйте, <strong>${user.email}</strong>,</p>
          <p>${
            isSuccess
              ? `Ваш платеж на сумму <strong>${payment.amount} ${payment.currency}</strong> успешно обработан.`
              : `К сожалению, произошла ошибка при оплате <strong>${payment.amount} ${payment.currency}</strong>. Пожалуйста, попробуйте снова.`
          }</p>
          <p>Номер транзакции: <strong>${payment.transactionId || 'Не найден'}</strong></p>
          <p style="margin-top: 20px; text-align: center;">
            <a href="https://yourapp.com/payments" style="display: inline-block; padding: 10px 20px; color: white; text-decoration: none; border-radius: 5px; ${
              isSuccess ? 'background: #2e7d32;' : 'background: #c62828;'
            }">
              ${isSuccess ? 'Перейти в личный кабинет' : 'Попробовать снова'}
            </a>
          </p>
          <p style="font-size: 12px; text-align: center; margin-top: 20px; color: #666;">Если у вас возникли вопросы, свяжитесь с нами.</p>
        </div>
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
