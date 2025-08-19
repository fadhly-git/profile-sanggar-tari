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
}

// Daftar path yang perlu di-revalidate
export const CACHE_PATHS: CacheItem[] = [
    // Halaman utama
    {
        id: 'home',
        type: 'page',
        path: '/',
        label: 'Homepage',
        description: 'Halaman utama website'
    },

    // Halaman konten berdasarkan schema Anda
    {
        id: 'articles',
        type: 'page',
        path: '/articles',
        label: 'Artikel',
        description: 'Halaman daftar artikel'
    },
    {
        id: 'articles-slug',
        type: 'page',
        path: '/articles/[slug]',
        label: 'Detail Artikel',
        description: 'Halaman detail artikel'
    },

    // Gallery
    {
        id: 'gallery',
        type: 'page',
        path: '/gallery',
        label: 'Gallery',
        description: 'Halaman gallery foto/video'
    },
    {
        id: 'gallery-category',
        type: 'page',
        path: '/gallery/[category]',
        label: 'Gallery Kategori',
        description: 'Halaman gallery per kategori'
    },

    // Schedule/Calendar
    {
        id: 'schedule',
        type: 'page',
        path: '/schedule',
        label: 'Jadwal Kegiatan',
        description: 'Halaman kalendar kegiatan'
    },

    // FAQ
    {
        id: 'faq',
        type: 'page',
        path: '/faq',
        label: 'FAQ',
        description: 'Halaman frequently asked questions'
    },

    // Contact
    {
        id: 'contact',
        type: 'page',
        path: '/contact',
        label: 'Kontak',
        description: 'Halaman kontak dan formulir'
    },

    // About pages
    {
        id: 'about',
        type: 'page',
        path: '/about',
        label: 'Tentang Kami',
        description: 'Halaman tentang organisasi'
    },

    // API Routes yang mungkin di-cache
    {
        id: 'api-articles',
        type: 'api',
        path: '/api/articles',
        label: 'API Artikel',
        description: 'API endpoint untuk artikel'
    },
    {
        id: 'api-gallery',
        type: 'api',
        path: '/api/gallery',
        label: 'API Gallery',
        description: 'API endpoint untuk gallery'
    },
    {
        id: 'api-schedule',
        type: 'api',
        path: '/api/schedule',
        label: 'API Schedule',
        description: 'API endpoint untuk jadwal'
    }
]
