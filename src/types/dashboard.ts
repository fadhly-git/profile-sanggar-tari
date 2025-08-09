export interface DashboardStats {
  totalArticles: number;
  totalGalleryItems: number;
  totalEvents: number;
  totalMessages: number;
}

export interface ArticlesByStatus {
  published: number;
  draft: number;
  archived: number;
}

export interface GalleryByType {
  image: number;
  video: number;
}

export interface RecentArticle {
  id: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt: string | null;
  createdAt: string;
  author: {
    name: string;
  };
}

export interface TodayEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date | string;
  endDate?: Date | string;
  location?: string;
  isRecurring?: boolean;
}

export interface RecentMessage {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
  isRead: boolean;
}

export interface ExtendedDashboardData {
  stats: DashboardStats;
  articlesByStatus: ArticlesByStatus;
  galleryByType: GalleryByType;
  recentArticles: RecentArticle[];
  todayEvents: TodayEvent[];
  recentMessages: RecentMessage[];
  thisWeekEvents: number;
}