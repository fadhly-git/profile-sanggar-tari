// lib/actions/email-actions.ts
"use server";

import nodemailer from "nodemailer";
import { updateContactReply } from "./contact-actions";

// Rate limiting store (dalam produksi, gunakan Redis)
const emailAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempts = emailAttempts.get(ip);

  if (!attempts || now > attempts.resetTime) {
    emailAttempts.set(ip, { count: 1, resetTime: now + 60000 }); // 1 menit
    return true;
  }

  if (attempts.count >= 10) { // maksimal 10 email per menit
    return false;
  }

  attempts.count++;
  return true;
}

function sanitizeHtml(html: string): string {
  // Sanitasi dasar - hapus script tags dan javascript: protocols
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

// Email terima kasih ketika customer submit form - EMAIL SAFE VERSION
export async function sendThankYouEmail(
  recipientEmail: string,
  recipientName: string,
  subject: string,
  message: string,
  userIp: string = "unknown"
) {
  try {
    // Rate limiting check
    if (!checkRateLimit(userIp)) {
      return { success: false, error: "Terlalu banyak email dikirim. Harap tunggu sebentar." };
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Template email terima kasih - Elegant Black & Gold Design
    const thankYouTemplate = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terima Kasih - Pesan Anda Telah Diterima</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f0f0f; color: #ffffff;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0; background-color: #0f0f0f;">
        <tr>
            <td style="padding: 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border-radius: 12px; overflow: hidden; max-width: 600px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%); padding: 30px 30px; text-align: center; color: #000000;">
                            <h1 style="margin: 0 0 5px 0; font-size: 22px; font-weight: 400; color: #000000; letter-spacing: 0.5px;">Terima Kasih</h1>
                            <p style="margin: 0; font-size: 12px; color: rgba(0,0,0,0.6); text-transform: uppercase; letter-spacing: 1px;">Pesan Berhasil Diterima</p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px;">
                            
                            <!-- Greeting -->
                            <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #d4af37; font-weight: 400;">Dear ${recipientName},</h2>

                            <!-- Main Message -->
                            <p style="margin: 0 0 25px 0; line-height: 1.5; color: #cccccc; font-size: 15px;">
                                Pesan Anda telah berhasil diterima dan akan ditinjau oleh tim kami dalam waktu 1x24 jam.
                            </p>

                            <!-- Message Details -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #2a2a2a; border: 1px solid #3a3a3a; border-radius: 6px; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <div style="margin-bottom: 15px;">
                                            <div style="color: #d4af37; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Subjek</div>
                                            <div style="color: #ffffff; font-size: 14px; font-weight: 500;">${subject}</div>
                                        </div>
                                        <div>
                                            <div style="color: #d4af37; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Pesan</div>
                                            <div style="color: #cccccc; line-height: 1.4; padding: 12px; background-color: #1a1a1a; border-radius: 4px; border-left: 2px solid #d4af37; font-size: 13px;">${message}</div>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Next Steps -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); border-radius: 6px; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 400; color: #000000;">Langkah Selanjutnya</h3>
                                        <p style="margin: 0; line-height: 1.4; color: rgba(0,0,0,0.7); font-size: 13px;">
                                            Tim kami akan mengirimkan respons melalui email ini.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Closing -->
                            <p style="margin: 0; line-height: 1.5; color: #999999; font-size: 13px;">
                                Terima kasih atas kepercayaan Anda kepada layanan kami.
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1a1a1a; padding: 20px 30px; border-top: 1px solid #3a3a3a; text-align: center;">
                            <p style="margin: 0 0 8px 0; color: #666666; font-size: 11px;">
                                Email konfirmasi otomatis
                            </p>
                            <div style="color: #d4af37; font-weight: 500; font-size: 12px;">
                                ${process.env.NEXT_PUBLIC_APP_NAME || 'Customer Service Team'}
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    // Kirim email
    await transporter.sendMail({
      from: `${process.env.NEXT_PUBLIC_APP_NAME || 'Customer Service'} <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `Konfirmasi Pesan Diterima - ${subject}`,
      html: thankYouTemplate,
    });

    return { success: true };
  } catch (error) {
    console.error("Error mengirim email terima kasih:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal mengirim email konfirmasi"
    };
  }
}

// Email balasan dari admin ke customer - EMAIL SAFE VERSION
export async function sendReplyEmail(
  contactId: string,
  recipientEmail: string,
  recipientName: string,
  subject: string,
  replyMessage: string,
  originalMessage: string,
  userIp: string = "unknown"
) {
  try {
    // Rate limiting check
    if (!checkRateLimit(userIp)) {
      return { success: false, error: "Terlalu banyak email dikirim. Harap tunggu sebentar." };
    }

    // Sanitize input
    const sanitizedReply = sanitizeHtml(replyMessage);

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Template email balasan - Clean & Simple Design
    const replyTemplate = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Respons untuk Pesan Anda</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f0f0f; color: #ffffff;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0; background-color: #0f0f0f;">
        <tr>
            <td style="padding: 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border-radius: 12px; overflow: hidden; max-width: 600px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%); padding: 25px 30px; color: #000000;">
                            <h1 style="margin: 0; font-size: 20px; font-weight: 400; color: #000000; letter-spacing: 0.5px;">Re: ${subject}</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px;">
                            
                            <!-- Greeting -->
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #d4af37;">Dear ${recipientName},</p>

                            <!-- Response Content -->
                            <div style="background-color: #ffffff; color: #333333; padding: 25px; border-radius: 8px; margin-bottom: 25px; line-height: 1.6; font-size: 15px; white-space: pre-line;">${sanitizedReply}</div>

                            <!-- Original Message Reference -->
                            <div style="border-top: 1px solid #3a3a3a; padding-top: 20px;">
                                <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Pesan Asli:</p>
                                <div style="background-color: #2a2a2a; padding: 15px; border-radius: 6px; border-left: 3px solid #d4af37;">
                                    <div style="color: #cccccc; font-size: 13px; line-height: 1.4;">${originalMessage}</div>
                                </div>
                            </div>

                            <!-- Signature -->
                            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #3a3a3a;">
                                <p style="margin: 0; color: #d4af37; font-size: 14px;">
                                    Best regards,<br>
                                    <strong>Customer Service Team</strong>
                                </p>
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1a1a1a; padding: 20px 30px; border-top: 1px solid #3a3a3a; text-align: center;">
                            <div style="color: #d4af37; font-weight: 500; font-size: 12px;">
                                ${process.env.NEXT_PUBLIC_APP_NAME || 'Customer Service Team'}
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    // Kirim email balasan
    await transporter.sendMail({
      from: `${process.env.NEXT_PUBLIC_APP_NAME || 'Customer Service'} <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `Re: ${subject}`,
      html: replyTemplate,
    });

    // Update status kontak
    const updateResult = await updateContactReply(contactId, sanitizedReply);

    if (!updateResult.success) {
      return { success: false, error: "Email berhasil dikirim tetapi gagal memperbarui status kontak" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error mengirim email balasan:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal mengirim email balasan"
    };
  }
}

// Admin notification - EMAIL SAFE VERSION
export async function sendAdminNotification(
  senderName: string,
  senderEmail: string,
  subject: string,
  message: string,
  contactId: string,
) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const adminNotificationTemplate = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pesan Baru dari Customer</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f0f0f; color: #ffffff;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0; background-color: #0f0f0f;">
        <tr>
            <td style="padding: 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border-radius: 12px; overflow: hidden; max-width: 600px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); border-top: 3px solid #d4af37;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%); padding: 25px 30px; text-align: center; color: #000000;">
                            <h1 style="margin: 0; font-size: 18px; font-weight: 400; color: #000000; letter-spacing: 0.5px;">Pesan Baru dari Customer</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px;">
                            
                            <!-- Alert -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #2a2a2a; border: 1px solid #d4af37; border-radius: 6px; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 15px; text-align: center;">
                                        <span style="color: #d4af37; font-size: 13px; font-weight: 500;">Pesan baru menunggu respons Anda</span>
                                    </td>
                                </tr>
                            </table>

                            <!-- Customer Info -->
                            <div style="margin-bottom: 25px;">
                                <div style="color: #d4af37; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Customer Information</div>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #2a2a2a; border: 1px solid #3a3a3a; border-radius: 6px;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="padding: 6px 0; border-bottom: 1px solid #3a3a3a; width: 80px; color: #999999; font-size: 11px; text-transform: uppercase;">Nama</td>
                                                    <td style="padding: 6px 0; border-bottom: 1px solid #3a3a3a; color: #ffffff; font-size: 13px;">${senderName}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 6px 0; border-bottom: 1px solid #3a3a3a; color: #999999; font-size: 11px; text-transform: uppercase;">Email</td>
                                                    <td style="padding: 6px 0; border-bottom: 1px solid #3a3a3a; color: #ffffff; font-size: 13px;">${senderEmail}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 6px 0; border-bottom: 1px solid #3a3a3a; color: #999999; font-size: 11px; text-transform: uppercase;">ID</td>
                                                    <td style="padding: 6px 0; border-bottom: 1px solid #3a3a3a; color: #ffffff; font-size: 13px;">${contactId}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 6px 0; color: #999999; font-size: 11px; text-transform: uppercase;">Waktu</td>
                                                    <td style="padding: 6px 0; color: #ffffff; font-size: 13px;">${new Date().toLocaleString('id-ID')}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Message Content -->
                            <div style="margin-bottom: 25px;">
                                <div style="color: #d4af37; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Message Details</div>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #2a2a2a; border: 1px solid #3a3a3a; border-radius: 6px;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <div style="margin-bottom: 15px;">
                                                <div style="color: #d4af37; font-size: 12px; margin-bottom: 5px;">Subjek:</div>
                                                <div style="color: #ffffff; font-size: 14px; font-weight: 500;">${subject}</div>
                                            </div>
                                            <div>
                                                <div style="color: #d4af37; font-size: 12px; margin-bottom: 8px;">Pesan:</div>
                                                <div style="color: #cccccc; line-height: 1.4; padding: 12px; background-color: #1a1a1a; border-radius: 4px; border-left: 2px solid #d4af37; font-size: 13px;">${message}</div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Action Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); border-radius: 6px;">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 400; color: #000000;">Action Required</h3>
                                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/contact-submissions" style="display: inline-block; padding: 2px 4px; background-color: rgba(0,0,0,0.1); color: #000000; text-decoration: none; font-weight: 500; font-size: 14px; border-radius: 4px; border: 1px solid rgba(0,0,0,0.2);">
                                            Balas Pesan
                                        </a>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1a1a1a; padding: 15px 30px; border-top: 1px solid #3a3a3a; text-align: center;">
                            <p style="margin: 0 0 5px 0; color: #666666; font-size: 11px;">Admin Notification</p>
                            <div style="color: #d4af37; font-weight: 500; font-size: 11px;">
                                ${process.env.NEXT_PUBLIC_APP_NAME || 'System'}
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    // Kirim notifikasi ke admin
    await transporter.sendMail({
      from: `${process.env.NEXT_PUBLIC_APP_NAME} System <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `New Message: ${subject}`,
      html: adminNotificationTemplate,
    });

    return { success: true };
  } catch (error) {
    console.error("Error mengirim notifikasi admin:", error);
    return { success: false, error: "Gagal mengirim notifikasi ke admin" };
  }
}