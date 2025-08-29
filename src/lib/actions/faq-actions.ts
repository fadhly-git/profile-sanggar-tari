'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const faqSchema = z.object({
    question: z.string().min(1, 'Pertanyaan wajib diisi'),
    answer: z.string().min(1, 'Jawaban wajib diisi'),
    order: z.number().int().min(0, 'Urutan harus berupa angka positif'),
    isActive: z.boolean()
})

export async function getFAQs() {
    try {
        const faqs = await prisma.fAQ.findMany({
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ]
        })
        return { success: true, data: faqs }
    } catch (error) {
        console.error('Error fetching FAQs:', error)
        return { success: false, error: 'Gagal mengambil data FAQ' }
    }
}

export async function getFAQById(id: string) {
    try {
        const faq = await prisma.fAQ.findUnique({
            where: { id }
        })

        if (!faq) {
            return { success: false, error: 'FAQ tidak ditemukan' }
        }

        return { success: true, data: faq }
    } catch (error) {
        console.error('Error fetching FAQ:', error)
        return { success: false, error: 'Gagal mengambil data FAQ' }
    }
}

export async function createFAQ(data: z.infer<typeof faqSchema>) {
    try {
        const validatedData = faqSchema.parse(data)

        const faq = await prisma.fAQ.create({
            data: validatedData
        })

        revalidatePath('/admin/faqs')
        revalidatePath('/', 'layout')
        revalidatePath('/kontak')
        return { success: true, data: faq }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }
        console.error('Error creating FAQ:', error)
        return { success: false, error: 'Gagal membuat FAQ' }
    }
}

export async function updateFAQ(id: string, data: z.infer<typeof faqSchema>) {
    try {
        const validatedData = faqSchema.parse(data)

        const faq = await prisma.fAQ.update({
            where: { id },
            data: validatedData
        })

        revalidatePath('/admin/faqs')
        revalidatePath('/', 'layout')
        revalidatePath('/kontak')
        return { success: true, data: faq }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }
        console.error('Error updating FAQ:', error)
        return { success: false, error: 'Gagal memperbarui FAQ' }
    }
}

export async function deleteFAQ(id: string) {
    try {
        await prisma.fAQ.delete({
            where: { id }
        })

        revalidatePath('/admin/faqs')
        revalidatePath('/', 'layout')
        revalidatePath('/kontak')
        return { success: true }
    } catch (error) {
        console.error('Error deleting FAQ:', error)
        return { success: false, error: 'Gagal menghapus FAQ' }
    }
}

export async function toggleFAQStatus(id: string) {
    try {
        const faq = await prisma.fAQ.findUnique({
            where: { id }
        })

        if (!faq) {
            return { success: false, error: 'FAQ tidak ditemukan' }
        }

        const updatedFAQ = await prisma.fAQ.update({
            where: { id },
            data: { isActive: !faq.isActive }
        })

        revalidatePath('/admin/faqs')
        revalidatePath('/', 'layout')
        revalidatePath('/kontak')
        return { success: true, data: updatedFAQ }
    } catch (error) {
        console.error('Error toggling FAQ status:', error)
        return { success: false, error: 'Gagal mengubah status FAQ' }
    }
}

export async function getActiveFaqs() {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        question: true,
        answer: true,
      },
    });

    return { success: true, data: faqs };
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return { success: false, error: "Gagal mengambil data FAQ" };
  }
}