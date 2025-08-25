// @/app/(public)/galeri/[slug]/page.tsx
import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Gallery4 } from '@/components/molecules/gallery-4'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getGalleryItemsByCategory } from '@/lib/actions/gallery-actions'
import { getAllSettings } from '@/lib/actions/setting-actions'

interface PageProps {
    params: {
        slug: string
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const categoryResult = await getGalleryItemsByCategory(params.slug)
    const settingsResult = await getAllSettings()

    if (!categoryResult.success) {
        return {
            title: 'Kategori Tidak Ditemukan',
        }
    }

    const category = categoryResult.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const settings: { site_name?: string; site_description?: string;[key: string]: any } = settingsResult.success && settingsResult.data ? settingsResult.data : {}
    const siteName = settings.site_name || 'Sanggar Tari Ngesti Laras Budaya'

    // Safe access to first image with proper null checks
    const firstImageUrl = category && category.items && category.items.length > 0 && category.items[0]?.imageUrl 
        ? category.items[0].imageUrl 
        : undefined

    return {
        title: `${category?.title ?? 'Kategori Tidak Ditemukan'} - Galeri - ${siteName}`,
        description: category?.description || `Koleksi foto ${category?.title ?? 'Kategori Tidak Ditemukan'} dari Sanggar Tari Ngesti Laras Budaya`,
        keywords: `galeri, ${category?.title ?? 'kategori'}, foto tari, dokumentasi sanggar`,
        openGraph: {
            title: `${category?.title ?? 'Kategori Tidak Ditemukan'} - Galeri - ${siteName}`,
            description: category?.description || `Koleksi foto ${category?.title ?? 'Kategori Tidak Ditemukan'} dari Sanggar Tari Ngesti Laras Budaya`,
            type: 'website',
            images: firstImageUrl ? [firstImageUrl] : undefined
        }
    }
}

async function GalleryDetailContent({ slug }: { slug: string }) {
    const categoryResult = await getGalleryItemsByCategory(slug)

    if (!categoryResult.success) {
        notFound()
    }

    const category = categoryResult.data

    // Transform data untuk Gallery4 with safe array access
    const galleryItems = ((category?.items) || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || undefined,
        imageUrl: item.imageUrl,
        category: {
            title: category?.title ?? '',
            slug: category?.slug ?? ''
        }
    }))

    if (galleryItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <Button variant="ghost" asChild>
                        <Link href="/galeri">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Galeri
                        </Link>
                    </Button>
                </div>

                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📸</div>
                    <h2 className="text-2xl font-semibold mb-2">{category?.title}</h2>
                    <p className="text-muted-foreground mb-4">
                        {category?.description || 'Belum ada foto dalam kategori ini'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Foto akan segera ditambahkan. Silakan kembali lagi nanti.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" asChild className="mb-8">
                    <Link href="/galeri">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Galeri
                    </Link>
                </Button>
            </div>

            <Gallery4
                title={category?.title}
                description={category?.description || `Koleksi foto dari kategori ${category?.title}. Setiap foto menampilkan momen berharga dan dokumentasi kegiatan yang telah kami laksanakan.`}
                items={galleryItems ?? []}
            />
        </div>
    )
}

export default function GalleryDetailPage({ params }: PageProps) {
    return (
        <>
            <Suspense fallback={
                <div className="min-h-screen">
                    <div className="container mx-auto px-4 py-8">
                        <div className="h-10 w-32 bg-muted rounded animate-pulse mb-8" />
                    </div>
                    <section className="flex w-full items-center justify-center pt-12">
                        <div className="container flex flex-col items-center gap-16">
                            <div className="max-w-5xl container">
                                <div className="animate-pulse space-y-4">
                                    <div className="h-8 bg-muted rounded w-1/2 mx-auto" />
                                    <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                                </div>
                            </div>
                            <div className="w-full max-w-7xl">
                                <div className="flex gap-4 overflow-hidden">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="min-w-[320px] h-[27rem] bg-muted rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            }>
                <GalleryDetailContent slug={params.slug} />
            </Suspense>
        </>
    )
}