import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';

class Mailer {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: env.EMAIL_FROM,
        to,
        subject,
        html,
      });
      logger.info(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      logger.error('Email send error:', error);
      // Don't throw — email failures shouldn't break core flows
    }
  }

  async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    const url = `${env.FRONTEND_URL}/verify-email?token=${token}`;
    await this.sendMail(
      email,
      'Verify Your Email – Aayug Organics',
      this.verificationTemplate(name, url),
    );
  }

  async sendPasswordResetEmail(email: string, name: string, token: string): Promise<void> {
    const url = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.sendMail(email, 'Reset Your Password – Aayug Organics', this.resetTemplate(name, url));
  }

  async sendOrderConfirmationEmail(email: string, name: string, orderNumber: string, total: number): Promise<void> {
    await this.sendMail(
      email,
      `Order Confirmed – ${orderNumber}`,
      this.orderConfirmTemplate(name, orderNumber, total),
    );
  }

  async sendShippingUpdateEmail(email: string, name: string, orderNumber: string, trackingNumber: string): Promise<void> {
    await this.sendMail(
      email,
      `Your Order ${orderNumber} Has Shipped!`,
      this.shippingTemplate(name, orderNumber, trackingNumber),
    );
  }

  async sendOtpEmail(email: string, code: string): Promise<void> {
    await this.sendMail(
      email,
      'Your Verification Code – Aayug Organics',
      this.otpTemplate(code),
    );
  }

  private otpTemplate(code: string): string {
    return this.baseTemplate('Your Verification Code', `
      <h2 style="color: #1b4332; text-align: center;">Your Verification Code 👋</h2>
      <p style="text-align: center; font-size: 16px; color: #4a5568;">
        Use the following one-time passcode (OTP) to securely log in or verify your account on Aayug Organics.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <div style="background: #f0fdf4; border: 2px dashed #1b4332; display: inline-block; padding: 15px 40px; border-radius: 12px;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1b4332;">${code}</span>
        </div>
      </div>
      <p style="color: #666; font-size: 14px; text-align: center;">This code is valid for 5 minutes. Please do not share this code with anyone.</p>
    `);
  }

  private baseTemplate(title: string, content: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>${title}</title></head>
      <body style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background: #fcfbf7; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; margin-top: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="background: #1b4332; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🌿 Aayug Organics</h1>
            <p style="color: #d4a373; margin: 5px 0 0;">Pure. Natural. Organic.</p>
          </div>
          <div style="padding: 40px 30px;">${content}</div>
          <div style="background: #f4f1ea; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p>Aayug Organics | Ahmedabad, Gujarat, India</p>
            <p>contact@aayugorganics.com | +91 9173631159</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private verificationTemplate(name: string, url: string): string {
    return this.baseTemplate('Verify Email', `
      <h2 style="color: #1b4332;">Hello, ${name}! 👋</h2>
      <p>Thank you for registering with Aayug Organics. Please verify your email address to get started.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background: #1b4332; color: white; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: 600;">Verify Email Address</a>
      </div>
      <p style="color: #666; font-size: 14px;">This link expires in 24 hours. If you didn't create an account, please ignore this email.</p>
    `);
  }

  private resetTemplate(name: string, url: string): string {
    return this.baseTemplate('Reset Password', `
      <h2 style="color: #1b4332;">Password Reset Request</h2>
      <p>Hi ${name}, we received a request to reset your password.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background: #1b4332; color: white; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset Password</a>
      </div>
      <p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
    `);
  }

  private orderConfirmTemplate(name: string, orderNumber: string, total: number): string {
    return this.baseTemplate('Order Confirmed', `
      <h2 style="color: #1b4332;">Order Confirmed! 🎉</h2>
      <p>Hi ${name}, your order has been placed successfully.</p>
      <div style="background: #f4f1ea; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Total Amount:</strong> ₹${total.toFixed(2)}</p>
      </div>
      <p>We'll send you another email once your order ships. Thank you for choosing Aayug Organics!</p>
    `);
  }

  private shippingTemplate(name: string, orderNumber: string, trackingNumber: string): string {
    return this.baseTemplate('Order Shipped', `
      <h2 style="color: #1b4332;">Your Order is on Its Way! 🚚</h2>
      <p>Hi ${name}, great news! Your order <strong>${orderNumber}</strong> has been shipped.</p>
      <div style="background: #f4f1ea; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
      </div>
    `);
  }
}

export const mailer = new Mailer();
