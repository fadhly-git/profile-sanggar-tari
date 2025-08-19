// /src/lib/cache/cache-actions.ts
'use server'

import { revalidatePath } from 'next/cache'
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