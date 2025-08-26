'use server'

import { type HeroSection, PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export interface HeroSectionFormData {
    imageUrl: string
    isActive: boolean
}

export async function createHeroSection(data: HeroSectionFormData) {
    try {
        const heroSection = await prisma.heroSection.create({
            data: {
                imageUrl: data.imageUrl,
                isActive: data.isActive,
            },
        })

        revalidatePath('/admin/hero-sections')
        return { success: true, data: heroSection }
    } catch (error) {
        console.error('Error creating hero section:', error)
        return { success: false, error: 'Gagal membuat hero section' }
    }
}

export async function updateHeroSection(id: string, data: HeroSectionFormData) {
    try {
        const heroSection = await prisma.heroSection.update({
            where: { id },
            data: {
                imageUrl: data.imageUrl,
                isActive: data.isActive,
            },
        })

        revalidatePath('/admin/hero-sections')
        return { success: true, data: heroSection }
    } catch (error) {
        console.error('Error updating hero section:', error)
        return { success: false, error: 'Gagal memperbarui hero section' }
    }
}

export async function deleteHeroSection(id: string) {
    try {
        await prisma.heroSection.delete({
            where: { id },
        })

        revalidatePath('/admin/hero-sections')
        return { success: true }
    } catch (error) {
        console.error('Error deleting hero section:', error)
        return { success: false, error: 'Gagal menghapus hero section' }
    }
}

export async function getHeroSections() {
    try {
        const heroSections = await prisma.heroSection.findMany({
            orderBy: { createdAt: 'desc' },
        })

        return heroSections
    } catch (error) {
        console.error('Error fetching hero sections:', error)
        return []
    }
}

export async function getActiveHeroSections(): Promise<HeroSection[]> {
  try {
    const heroSections = await prisma.heroSection.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return heroSections
  } catch (error) {
    console.error('Error fetching active hero sections:', error)
    return []
  }
}

export async function getHeroSectionById(id: string) {
    try {
        const heroSection = await prisma.heroSection.findUnique({
            where: { id },
        })

        return heroSection
    } catch (error) {
        console.error('Error fetching hero section:', error)
        return null
    }
}

export async function toggleHeroSectionStatus(id: string) {
    try {
        const current = await prisma.heroSection.findUnique({
            where: { id },
            select: { isActive: true }
        })

        if (!current) {
            return { success: false, error: 'Hero section tidak ditemukan' }
        }

        const heroSection = await prisma.heroSection.update({
            where: { id },
            data: { isActive: !current.isActive },
        })

        revalidatePath('/admin/hero-sections')
        return { success: true, data: heroSection }
    } catch (error) {
        console.error('Error toggling hero section status:', error)
        return { success: false, error: 'Gagal mengubah status hero section' }
    }
}