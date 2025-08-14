// @/lib/actions/gallery-actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { CreateGalleryItem, UpdateGalleryItem } from '@/types/gallery'

export async function createGalleryItem(data: CreateGalleryItem) {
    try {
        const item = await prisma.galleryItem.create({
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        revalidatePath('/admin/gallery')
        return { success: true, data: item }
    } catch (error) {
        console.error('Error creating gallery item:', error)
        return { success: false, error: 'Gagal membuat item galeri' }
    }
}

export async function updateGalleryItem(data: UpdateGalleryItem) {
    try {
        const { id, ...updateData } = data
        const item = await prisma.galleryItem.update({
            where: { id },
            data: updateData,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        revalidatePath('/admin/gallery')
        return { success: true, data: item }
    } catch (error) {
        console.error('Error updating gallery item:', error)
        return { success: false, error: 'Gagal memperbarui item galeri' }
    }
}

export async function deleteGalleryItem(id: string) {
    try {
        await prisma.galleryItem.delete({
            where: { id }
        })

        revalidatePath('/admin/gallery')
        return { success: true }
    } catch (error) {
        console.error('Error deleting gallery item:', error)
        return { success: false, error: 'Gagal menghapus item galeri' }
    }
}

export async function getGalleryItems() {
    try {
        const items = await prisma.galleryItem.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return { success: true, data: items }
    } catch (error) {
        console.error('Error fetching gallery items:', error)
        return { success: false, error: 'Gagal mengambil data galeri' }
    }
}

export async function getGalleryItemById(id: string) {
    try {
        const item = await prisma.galleryItem.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        if (!item) {
            return { success: false, error: 'Item galeri tidak ditemukan' }
        }

        return { success: true, data: item }
    } catch (error) {
        console.error('Error fetching gallery item:', error)
        return { success: false, error: 'Gagal mengambil item galeri' }
    }
}