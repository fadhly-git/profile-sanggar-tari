import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type User } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitialName(user?: User): string {
  if (!user?.name) return "";
  const words = user.name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  }).format(dateObj)
}

export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
};

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  }).format(dateObj)
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function getStatusLabel(status: string): string {
  const statusMap = {
    DRAFT: 'Draft',
    PUBLISHED: 'Dipublikasi',
    ARCHIVED: 'Diarsipkan'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

export function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const variantMap = {
    DRAFT: 'outline' as const,
    PUBLISHED: 'default' as const,
    ARCHIVED: 'secondary' as const
  }
  return variantMap[status as keyof typeof variantMap] || 'outline'
}

export function createExcerpt(content: string, maxLength: number = 100): string {
  // Remove HTML tags if any
  const cleanContent = content.replace(/<[^>]*>/g, '');

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  // Cut at word boundary
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  return lastSpaceIndex > 0
    ? truncated.substring(0, lastSpaceIndex) + '...'
    : truncated + '...';
}