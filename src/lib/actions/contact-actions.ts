// lib/actions/contact-actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { ContactStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { sendThankYouEmail, sendAdminNotification } from "@/lib/actions/email-actions";

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

export async function createContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    // Dapatkan IP address user
    const headersList = await headers();
    const userIp = headersList.get("x-forwarded-for") || 
                   headersList.get("x-real-ip") || 
                   "unknown";

    // Simpan ke database
    const contact = await prisma.contactSubmission.create({
      data,
    });

    // Kirim email terima kasih ke customer
    const thankYouResult = await sendThankYouEmail(
      contact.email,
      contact.name,
      contact.subject,
      contact.message,
      userIp
    );

    // Kirim notifikasi ke admin
    const adminNotification = await sendAdminNotification(
      contact.name,
      contact.email,
      contact.subject,
      contact.message,
      contact.id
    );

    return { 
      success: true, 
      data: contact,
      emailSent: thankYouResult.success,
      adminNotified: adminNotification.success
    };
  } catch (error) {
    console.error("Error creating contact:", error);
    return { success: false, error: "Failed to create contact" };
  }
}