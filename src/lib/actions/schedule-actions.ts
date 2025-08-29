'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { parseLocalDateTime } from '@/lib/utils/timezone'
import type { ScheduleEvent } from '@/types/schedule'
import { RecurringType, Prisma } from '@prisma/client'

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
    recurringEndDate: z.date().optional().nullable(),
    exceptions: z.array(z.date()).optional(),
})

export async function getUpcomingSchedules(limit: number = 5) {
    try {
        const now = new Date();
        const schedules = await prisma.scheduleEvent.findMany({
            where: {
                isActive: true,
                OR: [
                    {
                        startDate: {
                            gte: now
                        },
                        isRecurring: false
                    },
                    {
                        isRecurring: true
                    }
                ]
            },
            orderBy: { startDate: 'asc' },
            take: limit
        });

        return { success: true, data: schedules };
    } catch (error) {
        console.error("Error fetching schedules:", error);
        return { success: false, error: "Gagal mengambil jadwal" };
    }
}

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
        return events.map(event => {
            // Type the event with proper Prisma include type
            const eventData = event as typeof event & {
                exceptions?: string | null;
                recurringEndDate?: Date | null;
            };
            return {
                id: eventData.id,
                title: eventData.title,
                description: eventData.description || undefined,
                startDate: new Date(eventData.startDate),
                endDate: eventData.endDate ? new Date(eventData.endDate) : null,
                location: eventData.location || undefined,
                isActive: eventData.isActive,
                isRecurring: eventData.isRecurring,
                recurringType: eventData.recurringType || null,
                recurringEndDate: eventData.recurringEndDate ? new Date(eventData.recurringEndDate) : null,
                exceptions: eventData.exceptions ? JSON.parse(eventData.exceptions as string).map((date: string) => new Date(date)) : [],
                authorId: eventData.authorId,
                createdAt: new Date(eventData.createdAt),
                updatedAt: new Date(eventData.updatedAt),
                author: {
                    id: eventData.author.id,
                    name: eventData.author.name || 'Unknown',
                    email: eventData.author.email,
                }
            }
        })
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
            recurringEndDate: event.recurringEndDate ? new Date(event.recurringEndDate) : null,
            exceptions: event.exceptions ? JSON.parse(event.exceptions as string).map((date: string) => new Date(date)) : [],
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
        // Parse datetime dengan timezone yang benar
        const parsedStartDate = typeof data.startDate === 'string' 
            ? parseLocalDateTime(data.startDate) 
            : data.startDate
        const parsedEndDate = data.endDate 
            ? (typeof data.endDate === 'string' ? parseLocalDateTime(data.endDate) : data.endDate)
            : null
        const parsedRecurringEndDate = data.recurringEndDate 
            ? (typeof data.recurringEndDate === 'string' ? parseLocalDateTime(data.recurringEndDate) : data.recurringEndDate)
            : null

        const validatedData = scheduleSchema.parse({
            ...data,
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            recurringEndDate: parsedRecurringEndDate,
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
                recurringEndDate: validatedData.recurringEndDate,
                exceptions: validatedData.exceptions ? JSON.stringify(validatedData.exceptions.map(date => date.toISOString())) : Prisma.JsonNull,
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
        revalidatePath('/')
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {}

        if (data.title !== undefined) updateData.title = data.title
        if (data.description !== undefined) updateData.description = data.description || null
        if (data.startDate !== undefined) {
            updateData.startDate = typeof data.startDate === 'string' 
                ? parseLocalDateTime(data.startDate) 
                : data.startDate
        }
        if (data.endDate !== undefined) {
            updateData.endDate = data.endDate 
                ? (typeof data.endDate === 'string' ? parseLocalDateTime(data.endDate) : data.endDate)
                : null
        }
        if (data.location !== undefined) updateData.location = data.location || null
        if (data.isActive !== undefined) updateData.isActive = data.isActive
        if (data.isRecurring !== undefined) updateData.isRecurring = data.isRecurring
        if (data.recurringType !== undefined) updateData.recurringType = data.recurringType as RecurringType | null
        if (data.recurringEndDate !== undefined) {
            updateData.recurringEndDate = data.recurringEndDate 
                ? (typeof data.recurringEndDate === 'string' ? parseLocalDateTime(data.recurringEndDate) : data.recurringEndDate)
                : null
        }
        if (data.exceptions !== undefined) updateData.exceptions = data.exceptions ? JSON.stringify(data.exceptions.map(date => date.toISOString())) : null

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
        revalidatePath('/', 'layout')
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
        revalidatePath('/', 'layout')
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