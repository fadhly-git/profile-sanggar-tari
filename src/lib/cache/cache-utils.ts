// /src/lib/cache/cache-utils.ts
export interface CacheStats {
  totalPaths: number
  lastCleared: string | null
  cacheSize: string
  status: 'healthy' | 'warning' | 'error'
}

// Mock cache statistics (bisa diganti dengan implementasi sesungguhnya)
let cacheStats: CacheStats = {
  totalPaths: 0,
  lastCleared: null,
  cacheSize: 'Unknown',
  status: 'healthy'
}

export function getCacheStats(): CacheStats {
  return cacheStats
}

export function updateLastCleared(): void {
  cacheStats.lastCleared = new Date().toISOString()
}

export function setCacheStats(stats: Partial<CacheStats>): void {
  cacheStats = { ...cacheStats, ...stats }
}


export interface CacheItem {
    id: string
    type: 'page' | 'api' | 'data'
    path: string
    label: string
    description: string
    lastModified?: string
    tags?: string[]
    dependencies?: string[]
}

// Daftar path yang perlu di-revalidate
export const CACHE_PATHS: CacheItem[] = [
    // Halaman utama/Beranda
    {
        id: 'home',
        type: 'page',
        path: '/',
        label: 'Beranda',
        description: 'Halaman utama website',
        tags: ['homepage', 'public', 'beranda'],
        dependencies: ['api-articles', 'api-gallery', 'api-schedule']
    },

    // Halaman Artikel
    {
        id: 'articles',
        type: 'page',
        path: '/artikel',
        label: 'Artikel',
        description: 'Halaman daftar artikel',
        tags: ['articles', 'content', 'artikel'],
        dependencies: ['api-articles']
    },
    {
        id: 'articles-slug',
        type: 'page',
        path: '/artikel/[slug]',
        label: 'Detail Artikel',
        description: 'Halaman detail artikel',
        tags: ['articles', 'detail', 'content', 'artikel'],
        dependencies: ['api-articles']
    },

    // Halaman Galeri
    {
        id: 'gallery',
        type: 'page',
        path: '/galeri',
        label: 'Galeri',
        description: 'Halaman galeri foto/video',
        tags: ['gallery', 'media', 'galeri'],
        dependencies: ['api-gallery']
    },
    {
        id: 'gallery-category',
        type: 'page',
        path: '/galeri/[category]',
        label: 'Galeri Kategori',
        description: 'Halaman galeri per kategori',
        tags: ['gallery', 'category', 'media', 'galeri'],
        dependencies: ['api-gallery']
    },

    // Halaman Tentang Kami
    {
        id: 'about',
        type: 'page',
        path: '/tentang-kami',
        label: 'Tentang Kami',
        description: 'Halaman tentang sanggar tari',
        tags: ['about', 'company', 'tentang']
    },

    // Halaman Kontak Kami
    {
        id: 'contact',
        type: 'page',
        path: '/kontak-kami',
        label: 'Kontak Kami',
        description: 'Halaman kontak dan formulir',
        tags: ['contact', 'form', 'kontak']
    },

    // Schedule/Calendar (jika ada)
    {
        id: 'schedule',
        type: 'page',
        path: '/jadwal',
        label: 'Jadwal Kegiatan',
        description: 'Halaman kalendar kegiatan',
        tags: ['schedule', 'events', 'jadwal'],
        dependencies: ['api-schedule']
    },

    // FAQ (jika ada)
    {
        id: 'faq',
        type: 'page',
        path: '/faq',
        label: 'FAQ',
        description: 'Halaman frequently asked questions',
        tags: ['faq', 'help']
    },

    // API Routes yang mungkin di-cache
    {
        id: 'api-articles',
        type: 'api',
        path: '/api/artikel',
        label: 'API Artikel',
        description: 'API endpoint untuk artikel',
        tags: ['api', 'articles', 'content', 'artikel']
    },
    {
        id: 'api-gallery',
        type: 'api',
        path: '/api/galeri',
        label: 'API Galeri',
        description: 'API endpoint untuk galeri',
        tags: ['api', 'gallery', 'media', 'galeri']
    },
    {
        id: 'api-schedule',
        type: 'api',
        path: '/api/jadwal',
        label: 'API Jadwal',
        description: 'API endpoint untuk jadwal',
        tags: ['api', 'schedule', 'events', 'jadwal']
    },
    {
        id: 'api-contact',
        type: 'api',
        path: '/api/kontak',
        label: 'API Kontak',
        description: 'API endpoint untuk kontak',
        tags: ['api', 'contact', 'kontak']
    }
]
