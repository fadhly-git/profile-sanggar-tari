"use server"

import { PageContent } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const pageContentSchema = z.object({
  pageKey: z.string().min(1, "Page key harus diisi"),
  title: z.string().min(1, "Judul harus diisi"),
  content: z.string().min(1, "Konten harus diisi"),
  metadata: z.string().optional(),
  isActive: z.boolean().default(true)
})

export async function getPageContents() {
  try {
    const pageContents = await prisma.pageContent.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: pageContents }
  } catch (error) {
    console.error('Error fetching page contents:', error)
    return { success: false, error: 'Gagal mengambil data konten halaman' }
  }
}

export async function getPageContentById(id: string) {
  try {
    const pageContent = await prisma.pageContent.findUnique({
      where: { id }
    })
    if (!pageContent) {
      return { success: false, error: 'Konten halaman tidak ditemukan' }
    }
    return { success: true, data: pageContent }
  } catch (error) {
    console.error('Error fetching page content:', error)
    return { success: false, error: 'Gagal mengambil data konten halaman' }
  }
}

// @/lib/page-content/actions.ts (tambahkan ke file existing)

export async function getPageContentByKey(pageKey: string): Promise<PageContent | null> {
  try {
    const pageContent = await prisma.pageContent.findUnique({
      where: {
        pageKey: pageKey,
      },
    });

    return pageContent;
  } catch (error) {
    console.error('Error fetching page content by key:', error);
    return null;
  }
}

export async function createPageContent(formData: FormData) {
  try {
    const data = {
      pageKey: formData.get('pageKey') as string,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      metadata: formData.get('metadata') as string || undefined,
      isActive: formData.get('isActive') === 'true'
    }

    const validated = pageContentSchema.parse(data)

    await prisma.pageContent.create({
      data: validated
    })

    revalidatePath('/admin/page-content')
    redirect('/admin/page-content')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    console.error('Error creating page content:', error)
    return { success: false, error: 'Gagal membuat konten halaman' }
  }
}

export async function updatePageContent(id: string, formData: FormData) {
  try {
    const data = {
      pageKey: formData.get('pageKey') as string,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      metadata: formData.get('metadata') as string || undefined,
      isActive: formData.get('isActive') === 'true'
    }

    const validated = pageContentSchema.parse(data)

    await prisma.pageContent.update({
      where: { id },
      data: validated
    })

    revalidatePath('/admin/page-content')
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    console.error('Error updating page content:', error)
    return { success: false, error: 'Gagal memperbarui konten halaman', details: error }
  }
}

export async function deletePageContent(id: string) {
  try {
    await prisma.pageContent.delete({
      where: { id }
    })

    revalidatePath('/admin/page-content')
    return { success: true }
  } catch (error) {
    console.error('Error deleting page content:', error)
    return { success: false, error: 'Gagal menghapus konten halaman' }
  }
}

export async function togglePageContentStatus(id: string) {
  try {
    const pageContent = await prisma.pageContent.findUnique({
      where: { id }
    })

    if (!pageContent) {
      return { success: false, error: 'Konten halaman tidak ditemukan' }
    }

    await prisma.pageContent.update({
      where: { id },
      data: { isActive: !pageContent.isActive }
    })

    revalidatePath('/admin/page-content')
    return { success: true }
  } catch (error) {
    console.error('Error toggling page content status:', error)
    return { success: false, error: 'Gagal mengubah status konten halaman' }
  }
}