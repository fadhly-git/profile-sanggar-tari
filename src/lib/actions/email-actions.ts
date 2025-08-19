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

    // Template email terima kasih - TABLE BASED (EMAIL SAFE)
    const thankYouTemplate = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terima Kasih Telah Menghubungi Kami</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08); overflow: hidden; max-width: 600px;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #facc15 0%, #eab308 100%); padding: 60px 40px; text-align: center; color: #ffffff;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center;">
                                        <div style="width: 90px; height: 90px; margin: 0 auto 24px; background-color: rgba(255,255,255,0.15); border-radius: 50%; display: inline-block; line-height: 90px; text-align: center; border: 2px solid rgba(255,255,255,0.2);">
                                            <img src="https://absensi.ngelaras.my.id/img/logo.png" alt="Logo" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; vertical-align: middle;">
                                        </div>
                                        <h1 style="margin: 0 0 12px 0; font-size: 36px; font-weight: bold; color: #ffffff; text-shadow: 0 4px 8px rgba(0,0,0,0.1);">Terima Kasih!</h1>
                                        <p style="margin: 0; font-size: 18px; color: rgba(255,255,255,0.9);">Pesan Anda telah berhasil diterima</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 60px 50px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                
                                <!-- Greeting -->
                                <tr>
                                    <td style="padding-bottom: 32px;">
                                        <h2 style="margin: 0 0 0 0; font-size: 28px; color: #713f12; font-weight: bold;">Halo ${recipientName}! 👋</h2>
                                    </td>
                                </tr>

                                <!-- Intro Text -->
                                <tr>
                                    <td style="padding-bottom: 36px;">
                                        <p style="margin: 0; line-height: 1.7; color: #64748b; font-size: 17px;">
                                            Terima kasih telah menghubungi kami. Kami sangat menghargai kepercayaan Anda untuk berbagi pertanyaan atau masukan dengan tim kami.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Highlight Box -->
                                <tr>
                                    <td style="padding: 32px 0;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%); border-left: 6px solid #facc15; border-radius: 20px;">
                                            <tr>
                                                <td style="padding: 32px;">
                                                    <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #713f12; font-weight: bold;">Pesan Anda Telah Diterima</h3>
                                                    <p style="margin: 0; line-height: 1.6; color: #a16207; font-size: 16px;">
                                                        Tim customer service kami telah menerima pesan Anda dan akan segera meninjau serta memberikan respons terbaik dalam waktu maksimal <strong>7x24 jam</strong>.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Message Details -->
                                <tr>
                                    <td style="padding: 36px 0;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fefce8; border: 2px solid #fde047; border-radius: 20px;">
                                            <tr>
                                                <td style="padding: 32px;">
                                                    <div style="font-weight: 600; color: #713f12; margin-bottom: 16px; font-size: 16px;">
                                                        <strong>Subjek:</strong> ${subject}
                                                    </div>
                                                    <div style="color: #64748b; background: white; padding: 20px; border-radius: 12px; border: 1px solid #fde047; line-height: 1.6; word-wrap: break-word;">
                                                        ${message}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Next Steps -->
                                <tr>
                                    <td style="padding: 40px 0;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #facc15 0%, #eab308 100%); border-radius: 20px;">
                                            <tr>
                                                <td style="padding: 40px; text-align: center; color: #ffffff;">
                                                    <h3 style="margin: 0 0 16px 0; font-size: 22px; font-weight: bold;">🚀 Langkah Selanjutnya</h3>
                                                    <p style="margin: 0; line-height: 1.6; color: rgba(255,255,255,0.95); font-size: 16px;">
                                                        Tim kami sedang meninjau pesan Anda. Kami akan mengirimkan balasan detail ke email ini segera setelah analisis selesai. Pastikan untuk memeriksa folder inbox dan spam Anda.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Additional Message -->
                                <tr>
                                    <td style="padding: 0 0 50px 0;">
                                        <p style="margin: 0; line-height: 1.7; color: #64748b; font-size: 17px;">
                                            Jika Anda memiliki pertanyaan mendesak atau ingin menambahkan informasi, jangan ragu untuk menghubungi kami kembali atau melalui kontak langsung yang tersedia di website kami.
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #fefce8 0%, #f8fafc 100%); padding: 40px 50px; text-align: center; border-top: 1px solid #fde047;">
                            <p style="margin: 0 0 24px 0; color: #64748b; font-size: 14px; line-height: 1.5;">
                                Email ini dikirim secara otomatis sebagai konfirmasi bahwa pesan Anda telah diterima.<br>
                                Mohon jangan membalas email ini secara langsung.
                            </p>
                            <p style="margin: 0; color: #713f12; font-weight: bold; font-size: 16px;">
                                Salam hangat,<br>
                                <strong>${process.env.NEXT_PUBLIC_APP_NAME || 'Tim Customer Service'}</strong>
                            </p>
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
      subject: `Terima kasih telah menghubungi kami - ${subject}`,
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

    // Template email balasan - TABLE BASED (EMAIL SAFE)
    const replyTemplate = `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Balasan untuk Pesan Anda</title>
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0;">
      <tr>
        <td style="padding: 20px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08); overflow: hidden; max-width: 600px;">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #facc15 0%, #eab308 100%); padding: 60px 40px; text-align: center; color: #ffffff;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="text-align: center;">
                      <div style="width: 80px; height: 80px; margin: 0 auto 20px; background-color: rgba(255,255,255,0.15); border-radius: 50%; display: inline-block; line-height: 80px; text-align: center; border: 2px solid rgba(255,255,255,0.2);">
                        <span style="font-size: 36px;">💬</span>
                      </div>
                      <h1 style="margin: 0 0 12px 0; font-size: 32px; font-weight: bold; color: #ffffff; text-shadow: 0 4px 8px rgba(0,0,0,0.1);">💬 Balasan untuk Anda</h1>
                      <p style="margin: 0; font-size: 18px; color: rgba(255,255,255,0.9);">Tim kami telah meninjau pesan Anda</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 60px 50px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  
                  <!-- Greeting -->
                  <tr>
                    <td style="padding-bottom: 32px;">
                      <h2 style="margin: 0 0 0 0; font-size: 28px; color: #713f12; font-weight: bold;">Halo ${recipientName}, 👋</h2>
                    </td>
                  </tr>

                  <!-- Intro Text -->
                  <tr>
                    <td style="padding-bottom: 36px;">
                      <p style="margin: 0; line-height: 1.7; color: #64748b; font-size: 17px;">
                        Terima kasih atas kesabaran Anda menunggu. Tim customer service kami telah meninjau pesan Anda dengan seksama dan berikut adalah respons lengkap dari kami:
                      </p>
                    </td>
                  </tr>

                  <!-- Reply Section -->
                  <tr>
                    <td style="padding: 36px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 6px solid #0ea5e9; border-radius: 20px;">
                        <tr>
                          <td style="padding: 36px;">
                            <h3 style="margin: 0 0 20px 0; font-size: 20px; color: #0c4a6e; font-weight: bold;">
                              ✅ Respons Tim Kami
                            </h3>
                            <div style="color: #374151; line-height: 1.7; font-size: 16px; background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #bae6fd; white-space: pre-line; word-wrap: break-word; text-align: justify;">
                              ${sanitizedReply}
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Original Message Section -->
                  <tr>
                    <td style="padding: 40px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fefce8; border: 2px dashed #fde047; border-radius: 20px;">
                        <tr>
                          <td style="padding: 32px;">
                            <h4 style="margin: 0 0 16px 0; font-size: 18px; color: #713f12; font-weight: bold;">📧 Pesan Asli Anda:</h4>
                            <div style="background-color: #eab308; color: #ffffff; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-weight: bold;">
                              Subjek: ${subject}
                            </div>
                            <div style="color: #64748b; background: white; padding: 16px; border-radius: 12px; border: 1px solid #fde047; line-height: 1.6; word-wrap: break-word; text-align: justify;">
                              ${originalMessage}
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- CTA Section -->
                  <tr>
                    <td style="padding: 40px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #facc15 0%, #eab308 100%); border-radius: 20px;">
                        <tr>
                          <td style="padding: 40px; text-align: center; color: #ffffff;">
                            <h3 style="margin: 0 0 16px 0; font-size: 22px; font-weight: bold;">🤝 Butuh Bantuan Lebih Lanjut?</h3>
                            <p style="margin: 0; line-height: 1.6; color: rgba(255,255,255,0.95); font-size: 16px;">
                              Jika Anda memiliki pertanyaan tambahan atau memerlukan klarifikasi lebih lanjut, jangan ragu untuk menghubungi kami kembali. Tim kami selalu siap membantu Anda!
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Signature -->
                  <tr>
                    <td style="padding: 50px 0 0 0; border-top: 2px solid #fde047; margin-top: 32px;">
                      <p style="margin: 0 0 16px 0; line-height: 1.6; color: #64748b; font-size: 16px;">
                        Jika Anda memiliki pertanyaan lebih lanjut atau memerlukan klarifikasi tambahan, jangan ragu untuk menghubungi kami kembali. Kami selalu siap membantu Anda.
                      </p>
                      <p style="margin: 0 0 16px 0; font-weight: bold; color: #713f12; font-size: 16px;">
                        <strong>Terima kasih atas kepercayaan Anda kepada kami!</strong>
                      </p>
                      <p style="margin: 0; color: #64748b; font-size: 16px;">
                        Salam hangat,<br>
                        <span style="color: #eab308; font-weight: bold; font-size: 18px;">Tim Customer Service</span>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background: linear-gradient(135deg, #fefce8 0%, #f8fafc 100%); padding: 40px 50px; text-align: center; border-top: 1px solid #fde047;">
                <p style="margin: 0 0 24px 0; color: #64748b; font-size: 14px; line-height: 1.5;">
                  Email ini dikirim sebagai respons terhadap pertanyaan Anda.<br>
                  Jika Anda ingin melanjutkan percakapan, silakan hubungi kami melalui website.
                </p>
                <p style="margin: 0; color: #713f12; font-weight: bold; font-size: 16px;">
                  ${process.env.NEXT_PUBLIC_APP_NAME || 'Tim Customer Service'}
                </p>
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
  userIP: string = "unknown"
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
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #fef2f2;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08); overflow: hidden; max-width: 600px; border-top: 4px solid #ef4444;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 50px 40px; text-align: center; color: #ffffff;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center;">
                                        <div style="width: 80px; height: 80px; margin: 0 auto 20px; background-color: rgba(255,255,255,0.15); border-radius: 50%; display: inline-block; line-height: 80px; text-align: center; border: 2px solid rgba(255,255,255,0.2);">
                                            <span style="font-size: 36px;">🚨</span>
                                        </div>
                                        <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: bold; color: #ffffff; text-shadow: 0 4px 8px rgba(0,0,0,0.1);">🚨 Pesan Baru dari Customer</h1>
                                        <p style="margin: 0; font-size: 16px; color: rgba(255,255,255,0.9);">Memerlukan perhatian segera</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 50px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                
                                <!-- Alert Badge -->
                                <tr>
                                    <td style="padding-bottom: 32px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 2px solid #fecaca; border-radius: 16px;">
                                            <tr>
                                                <td style="padding: 16px 24px; text-align: center; color: #dc2626; font-weight: bold; font-size: 15px;">
                                                    🚨 Pesan baru telah diterima dan menunggu respons Anda
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Customer Info -->
                                <tr>
                                    <td style="padding-bottom: 32px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 2px solid #e2e8f0; border-radius: 20px;">
                                            <tr>
                                                <td style="padding: 32px;">
                                                    <h3 style="margin: 0 0 24px 0; font-size: 18px; color: #374151; font-weight: bold;">👤 Informasi Customer</h3>
                                                    
                                                    <!-- Customer Details -->
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; width: 120px; font-weight: bold; color: #64748b; font-size: 14px; vertical-align: top; text-transform: uppercase; letter-spacing: 0.5px;">NAMA:</td>
                                                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #374151; font-size: 14px; font-weight: 500;">${senderName}</td>
                                                        </tr>
                                                        <tr>
                                                                                                                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b; font-size: 14px; vertical-align: top; text-transform: uppercase; letter-spacing: 0.5px;">EMAIL:</td>
                                                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #374151; font-size: 14px; font-weight: 500;">${senderEmail}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b; font-size: 14px; vertical-align: top; text-transform: uppercase; letter-spacing: 0.5px;">ID KONTAK:</td>
                                                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #374151; font-size: 14px; font-weight: 500;">${contactId}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b; font-size: 14px; vertical-align: top; text-transform: uppercase; letter-spacing: 0.5px;">WAKTU:</td>
                                                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #374151; font-size: 14px; font-weight: 500;">${new Date().toLocaleString('id-ID')}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 12px 0; font-weight: bold; color: #64748b; font-size: 14px; vertical-align: top; text-transform: uppercase; letter-spacing: 0.5px;">IP ADDRESS:</td>
                                                            <td style="padding: 12px 0; color: #374151; font-size: 14px; font-weight: 500;">${userIP}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Message Content -->
                                <tr>
                                    <td style="padding-bottom: 32px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 20px; box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.05);">
                                            <tr>
                                                <td style="padding: 32px;">
                                                    <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #374151; font-weight: bold;">📧 Detail Pesan</h3>
                                                    
                                                    <!-- Subject -->
                                                    <div style="background-color: #f8fafc; padding: 16px; border-radius: 12px; margin-bottom: 16px; font-weight: bold; color: #374151; border-left: 4px solid #ef4444;">
                                                        <strong>Subjek:</strong> ${subject}
                                                    </div>
                                                    
                                                    <!-- Message Text -->
                                                    <div style="line-height: 1.7; color: #64748b; background-color: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; word-wrap: break-word;">
                                                        ${message}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Action Section -->
                                <tr>
                                    <td style="padding: 40px 0;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 20px;">
                                            <tr>
                                                <td style="padding: 40px; text-align: center; color: #ffffff;">
                                                    <h3 style="margin: 0 0 16px 0; font-size: 22px; font-weight: bold;">⚡ Action Required</h3>
                                                    <p style="margin: 0 0 24px 0; line-height: 1.6; color: rgba(255,255,255,0.95); font-size: 16px;">
                                                        Customer menunggu respons dari tim support. Klik tombol di bawah untuk membalas pesan ini.
                                                    </p>
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                                        <tr>
                                                            <td style="background-color: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.2); border-radius: 12px; text-align: center;">
                                                                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/contacts" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                                                                    💬 Balas Sekarang
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 32px 50px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px; line-height: 1.5;">
                                Email notifikasi otomatis untuk admin sistem
                            </p>
                            <p style="margin: 0; color: #374151; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                                Generated at ${new Date().toISOString()}
                            </p>
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
      subject: `🚨 Pesan Baru: ${subject}`,
      html: adminNotificationTemplate,
    });

    return { success: true };
  } catch (error) {
    console.error("Error mengirim notifikasi admin:", error);
    return { success: false, error: "Gagal mengirim notifikasi ke admin" };
  }
}