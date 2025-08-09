export interface BreadcrumbItem {
    title: string;
    href: string;
}

export type Role = 'ADMIN' | 'SUPER_ADMIN';

export interface User {
    id: string;
    email: string;
    name: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    articles: Article[];
    galleryItems: GalleryItem[];
    scheduleEvents: ScheduleEvent[];
}

export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featuredImage?: string;
    status: ArticleStatus;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    author: User;
}

export type MediaType = 'IMAGE' | 'VIDEO';

export interface GalleryItem {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    type: MediaType;
    category?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    author: User;
}

export type RecurringType = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface ScheduleEvent {
    id: string;
    title: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    location?: string;
    isRecurring: boolean;
    recurringType?: RecurringType;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    author: User;
}