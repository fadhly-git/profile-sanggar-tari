'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { generateSlug } from '@/lib/utils'

const galleryCategorySchema = z.object({
    title: z.string().min(1, 'Judul wajib diisi'),
    slug: z.string().min(1, 'Slug wajib diisi'),
    description: z.string().optional(),
    order: z.number().min(0, 'Urutan harus lebih dari 0'),
    isActive: z.boolean().default(true),
})

// Tambahkan function ini jika belum ada
export async function getActiveGalleryCategories() {
    try {
        const categories = await prisma.galleryCategory.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                order: 'asc'
            }
        })

        return categories
    } catch (error) {
        console.error('Error fetching active gallery categories:', error)
        return []
    }
}

export async function getGalleryCategories() {
    try {
        const categories = await prisma.galleryCategory.findMany({
            include: {
                author: {
                    select: { id: true, name: true, email: true }
                },
                _count: {
                    select: { items: true }
                }
            },
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ]
        })
        return categories
    } catch (error) {
        console.error('Error fetching gallery categories:', error)
        return []
    }
}

export async function getGalleryCategoryById(id: string) {
    try {
        const category = await prisma.galleryCategory.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, name: true, email: true }
                }
            }
        })
        return category
    } catch (error) {
        console.error('Error fetching gallery category:', error)
        return null
    }
}

export async function createGalleryCategory(formData: FormData) {
    const data = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string,
        order: parseInt(formData.get('order') as string) || 0,
        isActive: formData.get('isActive') === 'true',
        authorId: formData.get('authorId') as string,
    }

    try {
        const validatedData = galleryCategorySchema.parse(data)

        // Check if slug already exists
        const existingCategory = await prisma.galleryCategory.findUnique({
            where: { slug: validatedData.slug }
        })

        if (existingCategory) {
            throw new Error('Slug sudah digunakan')
        }

        await prisma.galleryCategory.create({
            data: {
                ...validatedData,
                authorId: data.authorId
            }
        })

        revalidatePath('/admin/gallery/')
        return { success: true }
    } catch (error) {
        console.error('Error creating gallery category:', error)
        throw error
    }
}

export async function updateGalleryCategory(id: string, formData: FormData) {
    const data = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string,
        order: parseInt(formData.get('order') as string) || 0,
        isActive: formData.get('isActive') === 'true',
    }

    try {
        const validatedData = galleryCategorySchema.parse(data)

        // Check if slug already exists (excluding current record)
        const existingCategory = await prisma.galleryCategory.findFirst({
            where: {
                slug: validatedData.slug,
                NOT: { id }
            }
        })

        if (existingCategory) {
            throw new Error('Slug sudah digunakan')
        }

        await prisma.galleryCategory.update({
            where: { id },
            data: validatedData
        })

        revalidatePath('/admin/gallery/')
        return { success: true }
    } catch (error) {
        console.error('Error updating gallery category:', error)
        throw error
    }
}

export async function deleteGalleryCategory(id: string) {
    try {
        await prisma.galleryCategory.delete({
            where: { id }
        })

        revalidatePath('/admin/gallery/')
        return { success: true }
    } catch (error) {
        console.error('Error deleting gallery category:', error)
        throw error
    }
}

export async function generateSlugCategoryGallery(title: string) {
    const baseSlug = generateSlug(title)

    let slug = baseSlug
    let counter = 1

    while (await prisma.galleryCategory.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`
        counter++
    }

    return slug
}