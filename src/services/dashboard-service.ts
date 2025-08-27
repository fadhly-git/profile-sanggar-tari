import { prisma } from '@/lib/prisma';
import { DashboardStats, DashboardOverview  } from '@/types/dashboard';

export class DashboardService {
    static async getDashboardStats(): Promise<DashboardStats> {
        const [
            totalArticles,
            totalGalleryItems,
            totalEvents,
            totalMessages,
            totalUnreadMessages
        ] = await Promise.all([
            // Total artikel
            prisma.article.count(),

            // Total gallery items yang aktif
            prisma.galleryItem.count({
                where: { isActive: true }
            }),

            // Total events yang aktif
            prisma.scheduleEvent.count({
                where: { isActive: true }
            }),

            // Total contact submissions
            prisma.contactSubmission.count(),

            // Total pesan yang belum dibaca
            prisma.contactSubmission.count({
                where: { repliedAt: null }
            })
        ]);

        return {
            totalArticles,
            totalGalleryItems,
            totalEvents,
            totalMessages,
            totalUnreadMessages
        };
    }

    static async getRecentArticles(limit: number = 5) {
        return await prisma.article.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        });
    }

    static async getTodayEvents() {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        return await prisma.scheduleEvent.findMany({
            where: {
                isActive: true,
                startDate: {
                    gte: startOfDay,
                    lt: endOfDay
                }
            },
            orderBy: {
                startDate: 'asc'
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        });
    }

    static async getDashboardOverview(): Promise<DashboardOverview> {
        const [stats, recentArticles, todayEvents] = await Promise.all([
            this.getDashboardStats(),
            this.getRecentArticles(),
            this.getTodayEvents()
        ]);

        return {
            stats,
            recentArticles,
            todayEvents
        };
    }

    // Method untuk mendapatkan artikel berdasarkan status
    static async getArticlesByStatus() {
        const [published, draft, archived] = await Promise.all([
            prisma.article.count({ where: { status: 'PUBLISHED' } }),
            prisma.article.count({ where: { status: 'DRAFT' } }),
            prisma.article.count({ where: { status: 'ARCHIVED' } })
        ]);

        return { published, draft, archived };
    }

    // Method untuk mendapatkan gallery berdasarkan tipe
    static async getGalleryByType() {
        const [images, videos] = await Promise.all([
            prisma.galleryItem.count({
                where: {
                    type: 'IMAGE',
                    isActive: true
                }
            }),
            prisma.galleryItem.count({
                where: {
                    type: 'VIDEO',
                    isActive: true
                }
            })
        ]);

        return { images, videos };
    }

    // Method untuk mendapatkan events minggu ini
    static async getThisWeekEvents() {
        const today = new Date();
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()) + 1);

        return await prisma.scheduleEvent.count({
            where: {
                isActive: true,
                startDate: {
                    gte: startOfWeek,
                    lt: endOfWeek
                }
            }
        });
    }

    // Method untuk mendapatkan pesan dalam 7 hari terakhir
    static async getRecentContactSubmissions() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        return await prisma.contactSubmission.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        });
    }
}