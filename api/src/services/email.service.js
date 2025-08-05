import nodemailer from "nodemailer";
import config from "../lib/config.lib.js";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: config.getOrThrow("SMTP_HOST"),
      port: parseInt(config.getOrThrow("SMTP_PORT")),
      secure: true,
      auth: {
        user: config.getOrThrow("SMTP_USER"),
        pass: config.getOrThrow("SMTP_PASS"),
      },
    });
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      const mailOptions = {
        from: config.getOrThrow("SMTP_FROM"),
        to,
        subject,
        html,
        text: text || this.stripHtml(html),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, "");
  }

  async sendApplicationSubmittedEmail(user, application) {
    const subject = "Scholarship Application Submitted - ACA Student Hub";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Application Submitted Successfully</h2>
        <p>Dear ${user.name},</p>
        <p>Your scholarship application has been successfully submitted to ACA Student Hub.</p>
        <p><strong>Application ID:</strong> ${application.id}</p>
        <p><strong>Status:</strong> ${application.status}</p>
        <p>We will review your application and get back to you within 2-3 business days.</p>
        <p>Thank you for your interest in our program!</p>
        <br>
        <p>Best regards,<br>ACA Student Hub Team</p>
      </div>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendApplicationStatusUpdateEmail(user, application, reviewer) {
    const subject = `Scholarship Application ${application.status.toUpperCase()} - ACA Student Hub`;
    const statusColor = application.status === 'approved' ? '#27ae60' : 
                       application.status === 'rejected' ? '#e74c3c' : '#f39c12';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Application Status Update</h2>
        <p>Dear ${user.name},</p>
        <p>Your scholarship application has been reviewed.</p>
        <p><strong>Application ID:</strong> ${application.id}</p>
        <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${application.status.toUpperCase()}</span></p>
        ${application.reviewer_notes ? `<p><strong>Reviewer Notes:</strong> ${application.reviewer_notes}</p>` : ''}
        ${reviewer ? `<p><strong>Reviewed by:</strong> ${reviewer.name}</p>` : ''}
        <p>Thank you for your interest in our program!</p>
        <br>
        <p>Best regards,<br>ACA Student Hub Team</p>
      </div>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendWelcomeEmail(user) {
    const subject = "Welcome to ACA Student Hub";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Welcome to ACA Student Hub!</h2>
        <p>Dear ${user.name},</p>
        <p>Welcome to ACA Student Hub! Your account has been successfully created.</p>
        <p>You can now:</p>
        <ul>
          <li>Browse available tracks and cohorts</li>
          <li>Submit scholarship applications</li>
          <li>Update your profile</li>
          <li>Track your application status</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <br>
        <p>Best regards,<br>ACA Student Hub Team</p>
      </div>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${config.getOrThrow("FRONTEND_URL")}/reset-password?token=${resetToken}`;
    const subject = "Password Reset Request - ACA Student Hub";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Password Reset Request</h2>
        <p>Dear ${user.name},</p>
        <p>You have requested to reset your password for your ACA Student Hub account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <br>
        <p>Best regards,<br>ACA Student Hub Team</p>
      </div>
    `;

    return this.sendEmail(user.email, subject, html);
  }
}

export default new EmailService(); 