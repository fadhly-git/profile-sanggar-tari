// /components/admin/cache-manager.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
    RefreshCw,
    Globe,
    Database,
    Server,
    Trash2,
    CheckCircle,
    AlertCircle,
    XCircle,
    Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { CACHE_PATHS } from '@/lib/cache/cache-utils'

interface CacheStats {
    totalPaths: number
    lastCleared: string | null
    cacheSize: string
    status: 'healthy' | 'warning' | 'error'
}

export default function CacheManager() {
    const [stats, setStats] = useState<CacheStats | null>(null)
    const [loading, setLoading] = useState<string | null>(null)
    const [clearingAll, setClearingAll] = useState(false)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/cache')
            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (error) {
            console.error('Failed to fetch cache stats:', error)
        }
    }

    const clearCacheByTag = async (tag: string) => {
        setLoading(tag)
        await clearCache('clear-tag', undefined, undefined, tag)
        setLoading(null)
    }

    const autoClear = async (contentType: 'article' | 'gallery' | 'schedule' | 'faq' | 'settings') => {
        setLoading(contentType)
        await clearCache('auto-clear', undefined, undefined, undefined, undefined, contentType)
        setLoading(null)
    }

    const clearCache = async (action: string, target?: string, type?: string, tag?: string, pathId?: string, contentType?: string) => {
        const loadingKey = target || type || tag || pathId || contentType || 'all'
        setLoading(loadingKey)

        try {
            const response = await fetch('/api/admin/cache', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, target, type, tag, pathId, contentType })
            })

            const result = await response.json()

            if (result.success) {
                toast.success(result.message)
                fetchStats()
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error('Gagal membersihkan cache', 
                { description: error instanceof Error ? error.message : 'Terjadi kesalahan' }
            )
        } finally {
            setLoading(null)
        }
    }

    const clearAllCache = async () => {
        setClearingAll(true)
        await clearCache('clear-all')
        setClearingAll(false)
    }

    const clearByType = async (type: 'page' | 'api' | 'data') => {
        await clearCache('clear-type', undefined, type)
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Belum pernah'
        return new Date(dateString).toLocaleString('id-ID')
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy':
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'warning':
                return <AlertCircle className="h-4 w-4 text-yellow-500" />
            case 'error':
                return <XCircle className="h-4 w-4 text-red-500" />
            default:
                return <CheckCircle className="h-4 w-4 text-gray-500" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'healthy':
                return <Badge variant="default" className="bg-green-500">Healthy</Badge>
            case 'warning':
                return <Badge variant="secondary">Warning</Badge>
            case 'error':
                return <Badge variant="destructive">Error</Badge>
            default:
                return <Badge variant="outline">Unknown</Badge>
        }
    }

    // Kelompokkan cache paths berdasarkan type
    const pageCache = CACHE_PATHS.filter(item => item.type === 'page')
    const apiCache = CACHE_PATHS.filter(item => item.type === 'api')
    const dataCache = CACHE_PATHS.filter(item => item.type === 'data')

    return (
        <div className="space-y-6">
            {/* Cache Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                            <Database className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium">Total Paths</p>
                                <p className="text-2xl font-bold">{stats?.totalPaths || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                            <Server className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-sm font-medium">Cache Size</p>
                                <p className="text-lg font-bold">{stats?.cacheSize || 'Unknown'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                            {stats && getStatusIcon(stats.status)}
                            <div>
                                <p className="text-sm font-medium">Status</p>
                                {stats && getStatusBadge(stats.status)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                            <RefreshCw className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm font-medium">Terakhir Dibersihkan</p>
                                <p className="text-sm font-bold">{formatDate(stats?.lastCleared ?? null)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Button
                            variant="outline"
                            onClick={() => clearByType('page')}
                            disabled={loading === 'page'}
                            className="flex items-center space-x-2"
                        >
                            <Globe className="h-4 w-4" />
                            <span>{loading === 'page' ? 'Clearing...' : 'Clear Page Cache'}</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => clearByType('api')}
                            disabled={loading === 'api'}
                            className="flex items-center space-x-2"
                        >
                            <Server className="h-4 w-4" />
                            <span>{loading === 'api' ? 'Clearing...' : 'Clear API Cache'}</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => clearByType('data')}
                            disabled={loading === 'data'}
                            className="flex items-center space-x-2"
                        >
                            <Database className="h-4 w-4" />
                            <span>{loading === 'data' ? 'Clearing...' : 'Clear Data Cache'}</span>
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" disabled={clearingAll}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {clearingAll ? 'Clearing...' : 'Clear All'}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Hapus Semua Cache</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Ini akan menghapus semua cache website termasuk halaman, API, dan data.
                                        Website mungkin akan sedikit lambat untuk beberapa saat setelah cache dibersihkan.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={clearAllCache}>
                                        Hapus Semua
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Cache Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Detailed Cache Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pages" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="pages">Pages ({pageCache.length})</TabsTrigger>
                            <TabsTrigger value="api">API ({apiCache.length})</TabsTrigger>
                            <TabsTrigger value="data">Data ({dataCache.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="pages" className="space-y-4 mt-4">
                            {pageCache.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Tidak ada page cache yang dikonfigurasi</p>
                            ) : (
                                <div className="grid gap-3">
                                    {pageCache.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/90"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Globe className="h-5 w-5 text-blue-500" />
                                                <div>
                                                    <h4 className="font-medium">{item.label}</h4>
                                                    <p className="text-sm">{item.path}</p>
                                                    <p className="text-xs text-gray-500">{item.description}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={loading === item.path}
                                                onClick={() => clearCache('clear-path', item.path)}
                                            >
                                                <RefreshCw className={`h-4 w-4 mr-2 ${loading === item.path ? 'animate-spin' : ''}`} />
                                                {loading === item.path ? 'Clearing...' : 'Clear'}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="api" className="space-y-4 mt-4">
                            {apiCache.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Tidak ada API cache yang dikonfigurasi</p>
                            ) : (
                                <div className="grid gap-3">
                                    {apiCache.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/90"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Server className="h-5 w-5 text-green-500" />
                                                <div>
                                                    <h4 className="font-medium">{item.label}</h4>
                                                    <p className="text-sm">{item.path}</p>
                                                    <p className="text-xs text-gray-500">{item.description}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={loading === item.path}
                                                onClick={() => clearCache('clear-path', item.path)}
                                            >
                                                <RefreshCw className={`h-4 w-4 mr-2 ${loading === item.path ? 'animate-spin' : ''}`} />
                                                {loading === item.path ? 'Clearing...' : 'Clear'}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="data" className="space-y-4 mt-4">
                            {dataCache.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Tidak ada data cache yang dikonfigurasi</p>
                            ) : (
                                <div className="grid gap-3">
                                    {dataCache.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/90"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Database className="h-5 w-5 text-purple-500" />
                                                <div>
                                                    <h4 className="font-medium">{item.label}</h4>
                                                    <p className="text-sm">{item.path}</p>
                                                    <p className="text-xs text-gray-500">{item.description}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={loading === item.path}
                                                onClick={() => clearCache('clear-path', item.path)}
                                            >
                                                <RefreshCw className={`h-4 w-4 mr-2 ${loading === item.path ? 'animate-spin' : ''}`} />
                                                {loading === item.path ? 'Clearing...' : 'Clear'}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Advanced Cache Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Advanced Cache Actions</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Clear cache berdasarkan tag atau content type
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Clear by Tag</Label>
                            <div className="flex flex-wrap gap-2">
                                {['artikel', 'galeri', 'jadwal', 'beranda', 'kontak', 'tentang'].map(tag => (
                                    <Button
                                        key={tag}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => clearCacheByTag(tag)}
                                        disabled={loading === tag}
                                    >
                                        {loading === tag ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                                        {tag}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Auto Clear by Content Type</Label>
                            <div className="flex flex-wrap gap-2">
                                {(['article', 'gallery', 'schedule', 'faq', 'settings'] as const).map(type => (
                                    <Button
                                        key={type}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => autoClear(type)}
                                        disabled={loading === type}
                                    >
                                        {loading === type ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                                        {type}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}