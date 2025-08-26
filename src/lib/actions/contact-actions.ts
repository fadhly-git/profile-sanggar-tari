// lib/actions/contact-actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { ContactStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendThankYouEmail, sendAdminNotification } from "@/lib/actions/email-actions";

interface RateLimitOptions {
  interval: number; // dalam milidetik
  maxRequests: number;
}

export async function rateLimit(
  identifier: string,
  options: RateLimitOptions = { interval: 15 * 60 * 1000, maxRequests: 3 } // 15 menit, max 3 request
) {
  const now = new Date();
  const windowStart = new Date(now.getTime() - options.interval);

  try {
    // Hapus record lama
    await prisma.$executeRaw`
      DELETE FROM contact_submissions 
      WHERE email = ${identifier} 
      AND createdAt < ${windowStart}
      AND status = 'PENDING'
    `;

    // Hitung request dalam window
    const requestCount = await prisma.contactSubmission.count({
      where: {
        email: identifier,
        createdAt: {
          gte: windowStart,
        },
      },
    });

    if (requestCount >= options.maxRequests) {
      return {
        success: false,
        error: `Terlalu banyak pesan. Coba lagi dalam ${Math.ceil(options.interval / 60000)} menit.`,
        resetTime: new Date(now.getTime() + options.interval),
      };
    }

    return { success: true, remaining: options.maxRequests - requestCount };
  } catch (error) {
    console.error("Rate limit error:", error);
    return { success: true, remaining: options.maxRequests }; // Fallback jika error
  }
}

export async function getContacts() {
  try {
    const contacts = await prisma.contactSubmission.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: contacts };
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return { success: false, error: "Failed to fetch contacts" };
  }
}

export async function getContactById(id: string) {
  try {
    const contact = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!contact) {
      return { success: false, error: "Contact not found" };
    }

    return { success: true, data: contact };
  } catch (error) {
    console.error("Error fetching contact:", error);
    return { success: false, error: "Failed to fetch contact" };
  }
}

export async function updateContactReply(
  id: string,
  replyMessage: string
) {
  try {
    const contact = await prisma.contactSubmission.update({
      where: { id },
      data: {
        status: ContactStatus.REPLIED,
        repliedAt: new Date(),
        replyMessage,
      },
    });

    revalidatePath("/admin/contacts");
    return { success: true, data: contact };
  } catch (error) {
    console.error("Error updating contact reply:", error);
    return { success: false, error: "Failed to update contact reply" };
  }
}

export async function deleteContact(id: string) {
  try {
    // Check if contact exists and is replied
    const contact = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!contact) {
      return { success: false, error: "Contact not found" };
    }

    if (contact.status !== ContactStatus.REPLIED) {
      return { success: false, error: "Can only delete replied messages" };
    }

    await prisma.contactSubmission.delete({
      where: { id },
    });

    revalidatePath("/admin/contacts");
    return { success: true };
  } catch (error) {
    console.error("Error deleting contact:", error);
    return { success: false, error: "Failed to delete contact" };
  }
}

// @/lib/actions/contact-actions.ts (update bagian createContact)
export async function createContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    // Rate limiting berdasarkan email
    const rateLimitResult = await rateLimit(data.email.toLowerCase());
    if (!rateLimitResult.success) {
      return { success: false, error: rateLimitResult.error };
    }

    // Validasi data
    if (!data.name.trim() || !data.email.trim() || !data.subject.trim() || !data.message.trim()) {
      return { success: false, error: "Semua field wajib diisi" };
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, error: "Format email tidak valid" };
    }

    // Simpan ke database
    const contact = await prisma.contactSubmission.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        subject: data.subject.trim(),
        message: data.message.trim(),
      },
    });

    // Kirim email (opsional)
    try {
      const thankYouResult = await sendThankYouEmail(
        contact.email,
        contact.name,
        contact.subject,
        contact.message
      );

      const adminNotification = await sendAdminNotification(
        contact.name,
        contact.email,
        contact.subject,
        contact.message,
        contact.id
      );
      if (!thankYouResult.success) {
        console.error("Thank you email failed:", thankYouResult.error);
      }
      if (!adminNotification.success) {
        console.error("Admin notification email failed:", adminNotification.error);
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Tetap return success karena pesan sudah tersimpan
    }

    revalidatePath("/kontak-kami");
    return { 
      success: true, 
      data: contact,
      message: "Pesan Anda telah terkirim. Terima kasih!"
    };
  } catch (error) {
    console.error("Error creating contact:", error);
    return { success: false, error: "Gagal mengirim pesan. Silakan coba lagi." };
  }
}