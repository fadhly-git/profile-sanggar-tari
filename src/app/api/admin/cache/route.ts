// /app/api/admin/cache/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import {
    clearCachePathAction,
    clearAllCacheAction,
    clearCacheByTypeAction,
    clearCacheByTagAction,
    clearCacheByDependencyAction,
    smartClearCacheAction,
    autoClearCacheAction,
    bulkClearCacheAction,
} from '@/lib/cache/cache-manager'
import { getCacheStats, updateLastCleared } from '@/lib/cache/cache-utils'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        // Check authorization - sesuaikan dengan sistem auth Anda
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { action, target, type, tag, paths, contentType, pathId } = await request.json()

        let result
        switch (action) {
            case 'clear-path':
                if (!target) {
                    return NextResponse.json({ error: 'Path is required' }, { status: 400 })
                }
                result = await clearCachePathAction(target)
                break

            case 'clear-type':
                if (!type) {
                    return NextResponse.json({ error: 'Type is required' }, { status: 400 })
                }
                result = await clearCacheByTypeAction(type)
                break

            case 'clear-tag':
                if (!tag) {
                    return NextResponse.json({ error: 'Tag is required' }, { status: 400 })
                }
                result = await clearCacheByTagAction(tag)
                break

            case 'clear-dependency':
                if (!target) {
                    return NextResponse.json({ error: 'Dependency ID is required' }, { status: 400 })
                }
                result = await clearCacheByDependencyAction(target)
                break

            case 'smart-clear':
                if (!pathId) {
                    return NextResponse.json({ error: 'Path ID is required' }, { status: 400 })
                }
                result = await smartClearCacheAction(pathId)
                break

            case 'auto-clear':
                if (!contentType) {
                    return NextResponse.json({ error: 'Content type is required' }, { status: 400 })
                }
                result = await autoClearCacheAction(contentType)
                break

            case 'bulk-clear':
                if (!paths || !Array.isArray(paths)) {
                    return NextResponse.json({ error: 'Paths array is required' }, { status: 400 })
                }
                result = await bulkClearCacheAction(paths)
                break

            case 'clear-all':
                result = await clearAllCacheAction()
                break

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
        }

        if (result.success) {
            updateLastCleared()
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error('Cache API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const stats = getCacheStats()
        return NextResponse.json(stats)
    } catch (error) {
        console.error('Cache stats error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}