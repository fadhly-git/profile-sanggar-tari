// /src/lib/cache/auto-cache.ts
'use server'

import { autoClearCacheAction, clearCacheByTagAction, smartClearCacheAction } from './cache-manager'

/**
 * Automatically clear cache when content is created/updated/deleted
 */
export async function handleContentCacheInvalidation(
    action: 'create' | 'update' | 'delete',
    contentType: 'article' | 'gallery' | 'schedule' | 'faq' | 'settings',
    contentId?: string
) {
    try {
        // Auto clear based on content type
        const result = await autoClearCacheAction(contentType)
        
        console.log(`Cache auto-cleared for ${contentType} ${action}:`, result.message)
        return result
    } catch (error) {
        console.error('Auto cache clearing failed:', error)
        return {
            success: false,
            message: `Auto cache clear failed: ${error}`
        }
    }
}

/**
 * Clear specific cache when article is published/unpublished
 */
export async function handleArticleCacheInvalidation(
    articleSlug: string,
    action: 'publish' | 'unpublish' | 'delete'
) {
    try {
        const paths = [
            '/',
            '/artikel',
            `/artikel/${articleSlug}`
        ]
        
        // Clear article-related tags
        await clearCacheByTagAction('articles')
        await clearCacheByTagAction('artikel')
        await clearCacheByTagAction('content')
        await clearCacheByTagAction('homepage')
        await clearCacheByTagAction('beranda')
        
        return {
            success: true,
            message: `Article cache cleared for ${action} action`
        }
    } catch (error) {
        console.error('Article cache clearing failed:', error)
        return {
            success: false,
            message: `Article cache clear failed: ${error}`
        }
    }
}

/**
 * Clear gallery cache when images are uploaded/deleted
 */
export async function handleGalleryCacheInvalidation(
    categorySlug?: string,
    action: 'upload' | 'delete' | 'category-change' = 'upload'
) {
    try {
        const tags = ['gallery', 'galeri', 'media', 'homepage', 'beranda']
        
        for (const tag of tags) {
            await clearCacheByTagAction(tag)
        }
        
        // If category specific, also clear category page
        if (categorySlug) {
            await smartClearCacheAction('gallery-category')
        }
        
        return {
            success: true,
            message: `Gallery cache cleared for ${action} action`
        }
    } catch (error) {
        console.error('Gallery cache clearing failed:', error)
        return {
            success: false,
            message: `Gallery cache clear failed: ${error}`
        }
    }
}

/**
 * Clear schedule cache when events are created/updated/deleted
 */
export async function handleScheduleCacheInvalidation(
    action: 'create' | 'update' | 'delete'
) {
    try {
        await clearCacheByTagAction('schedule')
        await clearCacheByTagAction('jadwal')
        await clearCacheByTagAction('events')
        await clearCacheByTagAction('homepage')
        await clearCacheByTagAction('beranda')
        
        return {
            success: true,
            message: `Schedule cache cleared for ${action} action`
        }
    } catch (error) {
        console.error('Schedule cache clearing failed:', error)
        return {
            success: false,
            message: `Schedule cache clear failed: ${error}`
        }
    }
}

/**
 * Clear all related cache when settings are changed
 */
export async function handleSettingsCacheInvalidation(
    settingKey: string,
    action: 'update'
) {
    try {
        // Settings might affect any page, so clear homepage and public tags
        await clearCacheByTagAction('homepage')
        await clearCacheByTagAction('beranda')
        await clearCacheByTagAction('public')
        
        // If it's a theme or layout setting, clear all pages
        if (settingKey.includes('theme') || settingKey.includes('layout') || settingKey.includes('logo')) {
            await autoClearCacheAction('settings')
        }
        
        return {
            success: true,
            message: `Settings cache cleared for ${settingKey} ${action}`
        }
    } catch (error) {
        console.error('Settings cache clearing failed:', error)
        return {
            success: false,
            message: `Settings cache clear failed: ${error}`
        }
    }
}

/**
 * Clear contact page cache when contact info is updated
 */
export async function handleContactCacheInvalidation(
    action: 'update'
) {
    try {
        await clearCacheByTagAction('contact')
        await clearCacheByTagAction('kontak')
        
        return {
            success: true,
            message: `Contact cache cleared for ${action} action`
        }
    } catch (error) {
        console.error('Contact cache clearing failed:', error)
        return {
            success: false,
            message: `Contact cache clear failed: ${error}`
        }
    }
}

/**
 * Clear about page cache when company info is updated
 */
export async function handleAboutCacheInvalidation(
    action: 'update'
) {
    try {
        await clearCacheByTagAction('about')
        await clearCacheByTagAction('tentang')
        await clearCacheByTagAction('company')
        
        return {
            success: true,
            message: `About page cache cleared for ${action} action`
        }
    } catch (error) {
        console.error('About page cache clearing failed:', error)
        return {
            success: false,
            message: `About page cache clear failed: ${error}`
        }
    }
}

/**
 * Clear homepage/beranda cache specifically
 */
export async function handleHomepageCacheInvalidation(
    reason: string = 'content update'
) {
    try {
        await clearCacheByTagAction('homepage')
        await clearCacheByTagAction('beranda')
        await clearCacheByTagAction('public')
        
        return {
            success: true,
            message: `Homepage cache cleared due to ${reason}`
        }
    } catch (error) {
        console.error('Homepage cache clearing failed:', error)
        return {
            success: false,
            message: `Homepage cache clear failed: ${error}`
        }
    }
}
