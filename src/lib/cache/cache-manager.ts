// /src/lib/cache/cache-actions.ts
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { CACHE_PATHS } from '@/lib/cache/cache-utils'

// Server action untuk clear cache berdasarkan path
export async function clearCachePathAction(path: string): Promise<{ success: boolean; message: string }> {
    try {
        revalidatePath(path)
        return {
            success: true,
            message: `Cache cleared for path: ${path}`
        }
    } catch (error) {
        console.error('Cache clear error:', error)
        return {
            success: false,
            message: `Failed to clear cache for ${path}: ${error}`
        }
    }
}

// Server action untuk clear semua cache
export async function clearAllCacheAction(): Promise<{ success: boolean; message: string }> {
    try {
        const results = await Promise.allSettled(
            CACHE_PATHS.map(item => clearCachePathAction(item.path))
        )

        const failed = results.filter(result =>
            result.status === 'rejected' ||
            (result.status === 'fulfilled' && !result.value.success)
        ).length

        if (failed === 0) {
            return {
                success: true,
                message: `Successfully cleared cache for ${results.length} paths`
            }
        } else {
            return {
                success: false,
                message: `Cleared ${results.length - failed} paths, ${failed} failed`
            }
        }
    } catch (error) {
        return {
            success: false,
            message: `Failed to clear all cache: ${error}`
        }
    }
}

// Server action untuk clear cache berdasarkan tipe
export async function clearCacheByTypeAction(type: 'page' | 'api' | 'data'): Promise<{ success: boolean; message: string }> {
    try {
        const pathsToInvalidate = CACHE_PATHS
            .filter(item => item.type === type)
            .map(item => item.path)

        const results = await Promise.allSettled(
            pathsToInvalidate.map(path => clearCachePathAction(path))
        )

        const failed = results.filter(result =>
            result.status === 'rejected' ||
            (result.status === 'fulfilled' && !result.value.success)
        ).length

        return {
            success: failed === 0,
            message: `Cleared ${pathsToInvalidate.length - failed} ${type} cache paths${failed > 0 ? `, ${failed} failed` : ''}`
        }
    } catch (error) {
        return {
            success: false,
            message: `Failed to clear ${type} cache: ${error}`
        }
    }
}

// Server action untuk clear cache berdasarkan tag
export async function clearCacheByTagAction(tag: string): Promise<{ success: boolean; message: string }> {
    try {
        const pathsToInvalidate = CACHE_PATHS
            .filter(item => item.tags?.includes(tag))
            .map(item => item.path)

        if (pathsToInvalidate.length === 0) {
            return {
                success: false,
                message: `No cache paths found for tag: ${tag}`
            }
        }

        const results = await Promise.allSettled(
            pathsToInvalidate.map(path => clearCachePathAction(path))
        )

        const failed = results.filter(result =>
            result.status === 'rejected' ||
            (result.status === 'fulfilled' && !result.value.success)
        ).length

        // Also clear the tag itself if using Next.js tag-based revalidation
        revalidateTag(tag)

        return {
            success: failed === 0,
            message: `Cleared ${pathsToInvalidate.length - failed} cache paths for tag '${tag}'${failed > 0 ? `, ${failed} failed` : ''}`
        }
    } catch (error) {
        return {
            success: false,
            message: `Failed to clear cache for tag ${tag}: ${error}`
        }
    }
}

// Server action untuk clear cache berdasarkan dependencies
export async function clearCacheByDependencyAction(dependencyId: string): Promise<{ success: boolean; message: string }> {
    try {
        const pathsToInvalidate = CACHE_PATHS
            .filter(item => item.dependencies?.includes(dependencyId))
            .map(item => item.path)

        if (pathsToInvalidate.length === 0) {
            return {
                success: true,
                message: `No dependent cache paths found for: ${dependencyId}`
            }
        }

        const results = await Promise.allSettled(
            pathsToInvalidate.map(path => clearCachePathAction(path))
        )

        const failed = results.filter(result =>
            result.status === 'rejected' ||
            (result.status === 'fulfilled' && !result.value.success)
        ).length

        return {
            success: failed === 0,
            message: `Cleared ${pathsToInvalidate.length - failed} dependent cache paths${failed > 0 ? `, ${failed} failed` : ''}`
        }
    } catch (error) {
        return {
            success: false,
            message: `Failed to clear dependent cache: ${error}`
        }
    }
}

// Server action untuk smart cache clearing - clear path dan dependencies
export async function smartClearCacheAction(pathId: string): Promise<{ success: boolean; message: string }> {
    try {
        const cacheItem = CACHE_PATHS.find(item => item.id === pathId)
        
        if (!cacheItem) {
            return {
                success: false,
                message: `Cache item not found: ${pathId}`
            }
        }

        // Clear the main path
        const mainResult = await clearCachePathAction(cacheItem.path)
        
        if (!mainResult.success) {
            return mainResult
        }

        // Clear dependent caches
        const dependentResult = await clearCacheByDependencyAction(pathId)

        return {
            success: true,
            message: `Smart cache clear completed for ${pathId}. ${mainResult.message}. ${dependentResult.message}`
        }
    } catch (error) {
        return {
            success: false,
            message: `Smart cache clear failed: ${error}`
        }
    }
}

// Server action untuk auto-clear berdasarkan content type yang di-update
export async function autoClearCacheAction(contentType: 'article' | 'gallery' | 'schedule' | 'faq' | 'settings'): Promise<{ success: boolean; message: string }> {
    try {
        const tagMap = {
            'article': ['articles', 'artikel', 'content', 'homepage', 'beranda'],
            'gallery': ['gallery', 'galeri', 'media', 'homepage', 'beranda'],
            'schedule': ['schedule', 'jadwal', 'events', 'homepage', 'beranda'],
            'faq': ['faq', 'help'],
            'settings': ['homepage', 'beranda', 'public', 'about', 'tentang'] // Settings might affect homepage and about page
        }

        const tagsToInvalidate = tagMap[contentType] || []
        const results = await Promise.allSettled(
            tagsToInvalidate.map(tag => clearCacheByTagAction(tag))
        )

        const totalCleared = results.reduce((acc, result) => {
            if (result.status === 'fulfilled' && result.value.success) {
                // Extract number from message like "Cleared 3 cache paths"
                const match = result.value.message.match(/Cleared (\d+)/)
                return acc + (match ? parseInt(match[1]) : 0)
            }
            return acc
        }, 0)

        return {
            success: true,
            message: `Auto-cleared ${totalCleared} cache paths for ${contentType} update`
        }
    } catch (error) {
        return {
            success: false,
            message: `Auto cache clear failed: ${error}`
        }
    }
}

// Server action untuk bulk clear berdasarkan multiple paths
export async function bulkClearCacheAction(paths: string[]): Promise<{ success: boolean; message: string }> {
    try {
        const results = await Promise.allSettled(
            paths.map(path => clearCachePathAction(path))
        )

        const successful = results.filter(result =>
            result.status === 'fulfilled' && result.value.success
        ).length

        const failed = results.length - successful

        return {
            success: failed === 0,
            message: `Bulk clear: ${successful} successful${failed > 0 ? `, ${failed} failed` : ''}`
        }
    } catch (error) {
        return {
            success: false,
            message: `Bulk cache clear failed: ${error}`
        }
    }
}