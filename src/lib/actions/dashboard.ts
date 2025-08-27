import { prisma } from '@/lib/prisma';
import { ExtendedDashboardData } from '@/types/dashboard';

export async function getDashboardData(): Promise<ExtendedDashboardData> {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  
  // Get start and end of current week
  const startOfWeek = new Date(todayStart);
  startOfWeek.setDate(todayStart.getDate() - todayStart.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  try {
    // Parallel queries for better performance
    const [
      totalArticles,
      totalGalleryItems,
      totalEvents,
      totalMessages,
      articlesByStatus,
      galleryByType,
      recentArticles,
      todayEvents,
      recentMessages,
      thisWeekEvents
    ] = await Promise.all([
      // Total counts
      prisma.article.count(),
      prisma.galleryItem.count({ where: { isActive: true } }),
      prisma.scheduleEvent.count({ where: { isActive: true } }),
      prisma.contactSubmission.count(),

      // Articles by status
      prisma.article.groupBy({
        by: ['status'],
        _count: { status: true }
      }),

      // Gallery by type
      prisma.galleryItem.groupBy({
        by: ['type'],
        where: { isActive: true },
        _count: { type: true }
      }),

      // Recent articles
      prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { name: true }
          }
        }
      }),

      // Today's events
      prisma.scheduleEvent.findMany({
        where: {
          isActive: true,
          startDate: {
            gte: todayStart,
            lt: todayEnd
          }
        },
        orderBy: { startDate: 'asc' }
      }),

      // Recent messages
      prisma.contactSubmission.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      }),

      // This week events count
      prisma.scheduleEvent.count({
        where: {
          isActive: true,
          startDate: {
            gte: startOfWeek,
            lt: endOfWeek
          }
        }
      })
    ]);

    // Process articles by status
    const statusCounts = {
      published: 0,
      draft: 0,
      archived: 0
    };

    articlesByStatus.forEach((item) => {
      switch (item.status) {
        case 'PUBLISHED':
          statusCounts.published = item._count.status;
          break;
        case 'DRAFT':
          statusCounts.draft = item._count.status;
          break;
        case 'ARCHIVED':
          statusCounts.archived = item._count.status;
          break;
      }
    });

    // Process gallery by type
    const typeCounts = {
      image: 0,
      video: 0
    };

    galleryByType.forEach((item) => {
      switch (item.type) {
        case 'IMAGE':
          typeCounts.image = item._count.type;
          break;
        case 'VIDEO':
          typeCounts.video = item._count.type;
          break;
      }
    });

    return {
      stats: {
        totalArticles,
        totalGalleryItems,
        totalEvents,
        totalMessages,
        totalUnreadMessages: recentMessages.filter(msg => !msg.repliedAt).length
      },
      articlesByStatus: statusCounts,
      galleryByType: typeCounts,
      recentArticles: recentArticles.map(article => ({
        id: article.id,
        title: article.title,
        status: article.status,
        publishedAt: article.publishedAt?.toISOString() || null,
        createdAt: article.createdAt.toISOString(),
        author: {
          name: article.author.name
        }
      })),
      todayEvents: todayEvents.map(event => ({
        id: event.id,
        title: event.title,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate ? event.endDate.toISOString() : undefined,
        location: event.location ?? undefined,
        description: event.description ?? undefined
      })),
      recentMessages: recentMessages.map(message => ({
        id: message.id,
        name: message.name,
        subject: message.subject,
        createdAt: message.createdAt.toISOString(),
        isRead: message.repliedAt !== null
      })),
      thisWeekEvents
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new Error('Failed to fetch dashboard data');
  }
}