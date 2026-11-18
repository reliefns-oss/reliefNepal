import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// Create reusable transporter object using SMTP transport
let transporter = null;

function getTransporter() {
  if (!transporter) {
    // Configure based on environment
    const config = {
      host: env.smtpHost || 'localhost',
      port: env.smtpPort || 587,
      secure: env.smtpSecure === 'true', // true for 465, false for other ports
      auth: env.smtpUser && env.smtpPass ? {
        user: env.smtpUser,
        pass: env.smtpPass,
      } : undefined,
    };

    // For development, use ethereal email or console logging
    if (env.nodeEnv === 'development' && !env.smtpHost) {
      console.log('[Email] Development mode - emails will be logged to console');
      return null;
    }

    transporter = nodemailer.createTransport(config);

    // Verify connection configuration
    transporter.verify((error) => {
      if (error) {
        console.error('[Email] SMTP connection error:', error.message);
      } else {
        console.log('[Email] SMTP server is ready');
      }
    });
  }
  return transporter;
}

/**
 * Send feedback notification email to admin
 * @param {Object} feedback - Feedback data
 * @returns {Promise<boolean>} - Success status
 */
export async function sendFeedbackNotification(feedback) {
  const transporter = getTransporter();

  // Format feedback data for email
  const formattedMessage = formatFeedbackForEmail(feedback);

  const mailOptions = {
    from: env.emailFrom || '"Relief Nepal" <noreply@reliefnepal.org.np>',
    to: env.feedbackEmail || 'feedback@reliefnepal.org.np',
    subject: `[Feedback] ${feedback.is_confidential ? 'Confidential' : 'Public'} Feedback/Complain`,
    text: formattedMessage,
    html: formatFeedbackForHtml(feedback),
  };

  // In development without SMTP, log to console
  if (!transporter) {
    console.log('[Email] Would send feedback notification:');
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('Body:', formattedMessage);
    return true;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Email] Feedback notification sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send feedback notification:', error.message);
    return false;
  }
}

/**
 * Format feedback data as plain text email
 */
function formatFeedbackForEmail(feedback) {
  const lines = [
    'Feedback & Complain Form Submission',
    '',
    'Section A: Feedback/Complain',
    feedback.feedback || 'Not provided',
    '',
    'Section B: Confidential',
    feedback.is_confidential ? 'Yes (हो)' : 'No (होइन)',
  ];

  if (!feedback.is_confidential) {
    lines.push(
      '',
      'Section C: Personal Details',
      `Name/Surname: ${feedback.name || 'Not provided'}`,
      `Gender: ${feedback.gender || 'Not provided'}`,
      `District: ${feedback.district || 'Not provided'}`,
      `Municipality: ${feedback.municipality || 'Not provided'}`,
      `Ward No: ${feedback.ward_no || 'Not provided'}`,
      `Village/Tope: ${feedback.village || 'Not provided'}`,
    );
  }

  lines.push(
    '',
    'Section D: Want Response',
    feedback.wants_response ? 'Yes (चाहन्छु)' : 'No',
  );

  if (feedback.wants_response) {
    lines.push(
      '',
      'Contact Details:',
      `Mobile No: ${feedback.mobile_no || 'Not provided'}`,
      `Email: ${feedback.email || 'Not provided'}`,
    );
  }

  lines.push(
    '',
    `Submitted: ${new Date(feedback.created_at).toLocaleString('en-NP', { timeZone: 'Asia/Kathmandu' })}`,
    `Reference ID: ${feedback.id}`,
  );

  return lines.join('\n');
}

/**
 * Escape dynamic values before placing them in an HTML email.
 */
function escapeHtml(text) {
  if (!text) return '<em>Not provided</em>';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>');
}

/**
 * Format feedback data as HTML email
 */
export function formatFeedbackForHtml(feedback) {
  const statusBadge = feedback.is_confidential
    ? '<span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 12px;">Confidential</span>'
    : '<span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 4px; font-size: 12px;">Public</span>';

  let html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">New Feedback Received</h1>
        <p style="margin: 10px 0 0; opacity: 0.9;">Relief Nepal Feedback System</p>
      </div>
      <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
        <p style="color: #374151;">A new feedback submission has been received.</p>
        ${statusBadge}

        <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #166534; margin-top: 0; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Feedback Details</h2>
          <p style="white-space: pre-wrap; color: #374151;">${escapeHtml(feedback.feedback)}</p>
        </div>
  `;

  if (!feedback.is_confidential) {
    html += `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #166534; margin-top: 0; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Personal Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Name:</td><td style="padding: 8px 0; color: #374151;">${escapeHtml(feedback.name)}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Gender:</td><td style="padding: 8px 0; color: #374151;">${escapeHtml(feedback.gender)}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #6b7280;">District:</td><td style="padding: 8px 0; color: #374151;">${escapeHtml(feedback.district)}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Municipality:</td><td style="padding: 8px 0; color: #374151;">${escapeHtml(feedback.municipality)}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Ward No:</td><td style="padding: 8px 0; color: #374151;">${escapeHtml(feedback.ward_no)}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Village/Tope:</td><td style="padding: 8px 0; color: #374151;">${escapeHtml(feedback.village)}</td></tr>
          </table>
        </div>
    `;
  }

  if (feedback.wants_response) {
    html += `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #166534; margin-top: 0; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Contact Details (Response Requested)</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Mobile:</td><td style="padding: 8px 0; color: #374151;">${escapeHtml(feedback.mobile_no)}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Email:</td><td style="padding: 8px 0; color: #374151;">${escapeHtml(feedback.email)}</td></tr>
          </table>
        </div>
    `;
  }

  html += `
        <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px; font-size: 12px; color: #6b7280;">
          <p style="margin: 0;"><strong>Reference ID:</strong> ${escapeHtml(feedback.id)}</p>
          <p style="margin: 5px 0 0;"><strong>Submitted:</strong> ${new Date(feedback.created_at).toLocaleString('en-NP', { timeZone: 'Asia/Kathmandu' })}</p>
        </div>
      </div>
    </div>
  `;

  return html;
}

/**
 * Send auto-reply to user if they provided email and want response
 * @param {Object} feedback - Feedback data
 * @returns {Promise<boolean>} - Success status
 */
export async function sendAutoReply(feedback) {
  if (!feedback.wants_response || !feedback.email) {
    return false;
  }

  const transporter = getTransporter();

  const mailOptions = {
    from: env.emailFrom || '"Relief Nepal" <noreply@reliefnepal.org.np>',
    to: feedback.email,
    subject: 'Thank you for your feedback - Relief Nepal',
    text: `Dear ${feedback.name || 'User'},\n\nThank you for submitting your feedback to Relief Nepal. We have received your message and will review it shortly.\n\nReference ID: ${feedback.id}\nSubmitted: ${new Date(feedback.created_at).toLocaleString('en-NP', { timeZone: 'Asia/Kathmandu' })}\n\nIf you requested a response, our team will get back to you soon.\n\nBest regards,\nRelief Nepal Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Thank You for Your Feedback</h1>
        </div>
        <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
          <p style="color: #374151;">Dear ${feedback.name || 'User'},</p>
          <p style="color: #374151;">Thank you for submitting your feedback to Relief Nepal. We have received your message and will review it shortly.</p>
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;"><strong>Reference ID:</strong> ${feedback.id}</p>
            <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px;"><strong>Submitted:</strong> ${new Date(feedback.created_at).toLocaleString('en-NP', { timeZone: 'Asia/Kathmandu' })}</p>
          </div>
          <p style="color: #374151;">If you requested a response, our team will get back to you soon.</p>
          <p style="color: #374151; margin-top: 30px;">Best regards,<br>Relief Nepal Team</p>
        </div>
      </div>
    `,
  };

  if (!transporter) {
    console.log('[Email] Would send auto-reply to:', feedback.email);
    return true;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Email] Auto-reply sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send auto-reply:', error.message);
    return false;
  }
}