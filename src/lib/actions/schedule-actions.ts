'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { ScheduleEvent } from '@/types/schedule'
import { RecurringType } from '@prisma/client'

// Schema validation
const scheduleSchema = z.object({
    title: z.string().min(1, 'Judul wajib diisi'),
    description: z.string().optional(),
    startDate: z.date(),
    endDate: z.date().optional().nullable(),
    location: z.string().optional(),
    isActive: z.boolean().default(true),
    isRecurring: z.boolean().default(false),
    recurringType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional().nullable(),
})

export async function getScheduleEvents(): Promise<ScheduleEvent[]> {
    try {
        const events = await prisma.scheduleEvent.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                startDate: 'desc'
            }
        })

        // Transform data to match ScheduleEvent interface
        return events.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description || undefined,
            startDate: new Date(event.startDate),
            endDate: event.endDate ? new Date(event.endDate) : null,
            location: event.location || undefined,
            isActive: event.isActive,
            isRecurring: event.isRecurring,
            recurringType: event.recurringType || null,
            authorId: event.authorId,
            createdAt: new Date(event.createdAt),
            updatedAt: new Date(event.updatedAt),
            author: {
                id: event.author.id,
                name: event.author.name || 'Unknown',
                email: event.author.email,
            }
        }))
    } catch (error) {
        console.error('Error fetching schedule events:', error)
        throw new Error('Gagal mengambil data jadwal kegiatan')
    }
}

export async function getScheduleEventById(id: string): Promise<ScheduleEvent | null> {
    try {
        const event = await prisma.scheduleEvent.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        })

        if (!event) return null

        return {
            id: event.id,
            title: event.title,
            description: event.description || undefined,
            startDate: new Date(event.startDate),
            endDate: event.endDate ? new Date(event.endDate) : null,
            location: event.location || undefined,
            isActive: event.isActive,
            isRecurring: event.isRecurring,
            recurringType: event.recurringType || null,
            authorId: event.authorId,
            createdAt: new Date(event.createdAt),
            updatedAt: new Date(event.updatedAt),
            author: {
                id: event.author.id,
                name: event.author.name || 'Unknown',
                email: event.author.email,
            }
        }
    } catch (error) {
        console.error('Error fetching schedule event:', error)
        return null
    }
}

export async function createScheduleEvent(data: z.infer<typeof scheduleSchema> & { authorId: string }) {
    try {
        const validatedData = scheduleSchema.parse({
            ...data,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : null,
        })

        const event = await prisma.scheduleEvent.create({
            data: {
                title: validatedData.title,
                description: validatedData.description || null,
                startDate: validatedData.startDate,
                endDate: validatedData.endDate,
                location: validatedData.location || null,
                isActive: validatedData.isActive,
                isRecurring: validatedData.isRecurring,
                recurringType: validatedData.recurringType as RecurringType | null,
                authorId: data.authorId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        })

        revalidatePath('/admin/schedule')
        return {
            success: true,
            message: 'Jadwal kegiatan berhasil dibuat',
            data: event
        }
    } catch (error) {
        console.error('Error creating schedule event:', error)
        return {
            success: false,
            message: 'Gagal membuat jadwal kegiatan'
        }
    }
}

export async function updateScheduleEvent(
    id: string,
    data: Partial<z.infer<typeof scheduleSchema>>
) {
    try {
        const updateData: Partial<{
            title: string
            description: string | null
            startDate: Date
            endDate: Date | null
            location: string | null
            isActive: boolean
            isRecurring: boolean
            recurringType: RecurringType | null
        }> = {}

        if (data.title !== undefined) updateData.title = data.title
        if (data.description !== undefined) updateData.description = data.description || null
        if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate)
        if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null
        if (data.location !== undefined) updateData.location = data.location || null
        if (data.isActive !== undefined) updateData.isActive = data.isActive
        if (data.isRecurring !== undefined) updateData.isRecurring = data.isRecurring
        if (data.recurringType !== undefined) updateData.recurringType = data.recurringType as RecurringType | null

        const event = await prisma.scheduleEvent.update({
            where: { id },
            data: updateData,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        })

        revalidatePath('/admin/schedule')
        return {
            success: true,
            message: 'Jadwal kegiatan berhasil diperbarui',
            data: event
        }
    } catch (error) {
        console.error('Error updating schedule event:', error)
        return {
            success: false,
            message: 'Gagal memperbarui jadwal kegiatan'
        }
    }
}

export async function deleteScheduleEvent(id: string) {
    try {
        await prisma.scheduleEvent.delete({
            where: { id }
        })

        revalidatePath('/admin/schedule')
        return {
            success: true,
            message: 'Jadwal kegiatan berhasil dihapus'
        }
    } catch (error) {
        console.error('Error deleting schedule event:', error)
        return {
            success: false,
            message: 'Gagal menghapus jadwal kegiatan'
        }
    }
}