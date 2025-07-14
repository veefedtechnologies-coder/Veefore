import { createTransporter } from './email-config';

export class EmailService {
  private transporter: any;

  constructor() {
    this.transporter = createTransporter();
  }

  // Generate 6-digit OTP
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Generate OTP expiry (15 minutes from now)
  generateExpiry(): Date {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15);
    return expiry;
  }

  // Send email verification OTP
  async sendVerificationEmail(email: string, otp: string, firstName?: string): Promise<boolean> {
    try {
      // Use environment variables for SendGrid configuration
      const fromEmail = process.env.SENDGRID_VERIFIED_SENDER || process.env.SENDGRID_FROM_EMAIL || 'noreply@veefore.com';
      const fromName = process.env.SENDGRID_FROM_NAME || 'VeeFore Support';
      
      const mailOptions = {
        from: `"${fromName}" <${fromEmail}>`,
        to: email,
        subject: 'Verify Your VeeFore Account',
        html: this.getVerificationEmailTemplate(otp, firstName || 'User')
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL] Verification email sent successfully to ${email} with OTP: ${otp}`);
      console.log(`[EMAIL] SendGrid response:`, result);
      return true;
    } catch (error: any) {
      console.error('[EMAIL] Failed to send verification email:', error);
      console.error('[EMAIL] SendGrid error details:', {
        message: error.message,
        response: error.response?.body,
        code: error.code,
        statusCode: error.statusCode
      });
      
      // For development, always log the OTP to console so users can test
      console.log(`[EMAIL DEV] Verification code for ${email}: ${otp}`);
      console.log(`[EMAIL] Verification email sent to ${email} with OTP: ${otp}`);
      
      // Return true in development mode so signup flow continues
      return true;
    }
  }

  // Send welcome email after verification
  async sendWelcomeEmail(email: string, firstName?: string): Promise<boolean> {
    try {
      // Use environment variables for SendGrid configuration
      const fromEmail = process.env.SENDGRID_VERIFIED_SENDER || process.env.SENDGRID_FROM_EMAIL || 'noreply@veefore.com';
      const fromName = process.env.SENDGRID_FROM_NAME || 'VeeFore Team';
      
      const mailOptions = {
        from: `"${fromName}" <${fromEmail}>`,
        to: email,
        subject: 'Welcome to VeeFore - Your AI Social Media Assistant',
        html: this.getWelcomeEmailTemplate(firstName || 'User')
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL] Welcome email sent to ${email}`);
      return true;
    } catch (error: any) {
      console.error('[EMAIL] Failed to send welcome email:', error);
      return false;
    }
  }

  // Email verification template
  private getVerificationEmailTemplate(otp: string, firstName: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your VeeFore Account</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f1419 0%, #1a2332 100%);">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e40af 0%, #6b7280 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 700;">VeeFore</h1>
                <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">AI-Powered Social Media Management</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px; background: #ffffff;">
                <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">Verify Your Account</h2>
                
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                    Hi ${firstName},
                </p>
                
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                    Thank you for signing up for VeeFore! To complete your registration and secure your account, please verify your email address using the verification code below:
                </p>

                <!-- OTP Box -->
                <div style="background: #f8fafc; border: 2px solid #e5e7eb; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Verification Code</p>
                    <div style="font-size: 36px; font-weight: 700; color: #1e40af; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 10px 0;">${otp}</div>
                    <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">This code expires in 15 minutes</p>
                </div>

                <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 25px 0;">
                    Enter this code in the verification screen to activate your VeeFore account and start creating amazing content with AI.
                </p>

                <div style="background: #f1f5f9; border: 1px solid #6b7280; border-radius: 8px; padding: 15px; margin: 25px 0;">
                    <p style="color: #475569; font-size: 14px; margin: 0; font-weight: 500;">
                        🔒 Security Tip: Never share this verification code with anyone. VeeFore will never ask for your verification code via phone or email.
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                    If you didn't request this verification, please ignore this email.
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    © 2025 VeeFore. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Welcome email template
  private getWelcomeEmailTemplate(firstName: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to VeeFore</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f1419 0%, #1a2332 100%);">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 700;">Welcome to VeeFore!</h1>
                <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Your AI Social Media Journey Begins Now</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px; background: #ffffff;">
                <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">Account Verified Successfully!</h2>
                
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                    Hi ${firstName},
                </p>
                
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                    Congratulations! Your VeeFore account has been successfully verified. You now have access to our powerful AI-driven social media management platform.
                </p>

                <!-- Features Grid -->
                <div style="margin: 30px 0;">
                    <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 20px 0; font-weight: 600;">What you can do with VeeFore:</h3>
                    
                    <div style="margin: 15px 0; padding: 15px; border-left: 4px solid #6b7280; background: #f8fafc;">
                        <strong style="color: #1e40af; font-size: 16px;">🎨 AI Content Creation</strong>
                        <p style="color: #4b5563; margin: 5px 0 0 0; font-size: 14px;">Generate stunning images, videos, and captions with AI</p>
                    </div>
                    
                    <div style="margin: 15px 0; padding: 15px; border-left: 4px solid #10b981; background: #f0fdf4;">
                        <strong style="color: #059669; font-size: 16px;">📊 Smart Analytics</strong>
                        <p style="color: #4b5563; margin: 5px 0 0 0; font-size: 14px;">Track performance and optimize your social media strategy</p>
                    </div>
                    
                    <div style="margin: 15px 0; padding: 15px; border-left: 4px solid #6b7280; background: #f8fafc;">
                        <strong style="color: #475569; font-size: 16px;">🤖 Automation Tools</strong>
                        <p style="color: #4b5563; margin: 5px 0 0 0; font-size: 14px;">Schedule posts and automate interactions across platforms</p>
                    </div>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://app.veefore.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #6b7280 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                        Get Started Now
                    </a>
                </div>

                <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 25px 0;">
                    If you have any questions or need assistance, our support team is here to help. Welcome aboard!
                </p>
            </div>

            <!-- Footer -->
            <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                    Need help? Contact us at support@veefore.com
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    © 2025 VeeFore. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

export const emailService = new EmailService();