// @/app/(public)/galeri/page.tsx (Update)
import { Suspense } from 'react'
import { Metadata } from 'next'
import SectionHeader from '@/components/atoms/section-header'
import GalleryCard from '@/components/molecules/gallery-card'
import { getActiveGalleryCategories } from '@/lib/actions/gallery-actions'
import { getAllSettings } from '@/lib/actions/setting-actions'

export async function generateMetadata(): Promise<Metadata> {
    const settingsResult = await getAllSettings()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const settings: { site_name?: string; site_description?: string;[key: string]: any } = settingsResult.success && settingsResult.data ? settingsResult.data : {}

    const siteName = settings.site_name || 'Sanggar Tari Ngesti Laras Budaya'

    return {
        title: `Galeri - ${siteName}`,
        description: 'Koleksi foto dan dokumentasi kegiatan Sanggar Tari Ngesti Laras Budaya. Lihat momen-momen berharga dari berbagai pertunjukan dan kegiatan tari tradisional dan modern.',
        keywords: 'galeri, foto tari, dokumentasi sanggar, pertunjukan tari, kegiatan tari',
        openGraph: {
            title: `Galeri - ${siteName}`,
            description: 'Koleksi foto dan dokumentasi kegiatan Sanggar Tari Ngesti Laras Budaya',
            type: 'website',
        }
    }
}

async function GalleryContent() {
    const categoriesResult = await getActiveGalleryCategories()
    const categories = categoriesResult.success ? categoriesResult.data : []

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <SectionHeader
                    title="Galeri Foto"
                    subtitle="Koleksi dokumentasi kegiatan dan pertunjukan tari berdasarkan kategori"
                    centered
                />
            </div>

            {(categories ?? []).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(categories ?? []).map((category) => (
                        <GalleryCard
                            key={category.id}
                            title={category.title}
                            slug={category.slug}
                            description={category.description || undefined}
                            itemCount={category._count.items}
                            coverImage={category.items[0]?.imageUrl}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎭</div>
                    <h3 className="text-xl font-semibold mb-2">Belum Ada Galeri</h3>
                    <p className="text-muted-foreground">
                        Galeri foto akan segera ditambahkan. Silakan kembali lagi nanti.
                    </p>
                </div>
            )}
        </div>
    )
}

export default function GalleryPage() {
    return (
        <>
            <section className="py-8 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Galeri</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Jelajahi koleksi foto dan momen berharga dari berbagai kegiatan
                            di Sanggar Tari Ngesti Laras Budaya
                        </p>
                    </div>
                </div>
            </section>

            <Suspense fallback={
                <div className="container mx-auto px-4 py-12">
                    <div className="animate-pulse">
                        <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-12" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="min-h-[27rem] bg-muted rounded-xl animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            }>
                <GalleryContent />
            </Suspense>
        </>
    )
}