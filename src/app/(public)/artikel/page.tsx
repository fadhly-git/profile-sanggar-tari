// @/app/(public)/artikel/page.tsx
import { Metadata } from "next";
import { getPublishedArticlesWithPagination } from "@/lib/actions/articles-action";
import { Suspense } from "react";
import { ArticleCardEnhanced } from "@/components/molecules/article-card-enhanced";
import { ArticleSearchFilter } from "@/components/molecules/article-search-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ArticlePagination from "./article-pagination";

export const metadata: Metadata = {
    title: "Artikel - Sanggar Tari Ngesti Laras Budaya",
    description: "Baca artikel terbaru tentang seni tari, budaya Indonesia, tips pembelajaran tari, dan berita kegiatan dari Sanggar Tari Ngesti Laras Budaya di Boja, Meteseh Boja, Kab. Kendal.",
    keywords: "sanggar tari, ngesti laras budaya, boja, meteseh boja, Kab. Kendal, seni tari, budaya, artikel tari, berita sanggar, tips tari",
    openGraph: {
        title: "Artikel - Sanggar Tari Ngesti Laras Budaya",
        description: "Baca artikel terbaru tentang seni tari, budaya Indonesia, tips pembelajaran tari, dan berita kegiatan dari Sanggar Tari Ngesti Laras Budaya.",
        url: "https://ngelaras.my.id/artikel",
        siteName: "Sanggar Tari Ngesti Laras Budaya",
        locale: "id_ID",
        type: "website",
    },
    alternates: {
        canonical: "https://ngelaras.my.id/artikel",
    },
};

interface ArticlePageProps {
    searchParams: {
        q?: string;
        sort?: string;
        page?: string;
    };
}

const ARTICLES_PER_PAGE = 9;

export default async function ArticlesPage({ searchParams }: ArticlePageProps) {
    // Await searchParams before using it
    const params = await searchParams;
    const searchQuery = params.q || "";
    const sortBy = params.sort || "newest";
    const currentPage = parseInt(params.page || "1");

    const articlesResult = await getPublishedArticlesWithPagination(
        currentPage,
        ARTICLES_PER_PAGE,
        searchQuery,
        sortBy
    );

    if (!articlesResult.success) {
        return <ErrorState />;
    }

    const { articles, totalCount, totalPages, hasNextPage, hasPrevPage } = articlesResult.data || {};

    return (
        <Suspense fallback={<ArticleListSkeleton />}>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Artikel</h1>
                    <p className="text-lg text-muted-foreground max-w-5xl mx-auto">
                        Temukan artikel menarik tentang seni tari, budaya Indonesia, tips pembelajaran, dan berita terbaru dari sanggar kami
                    </p>
                </div>

                {totalCount === 0 ? (
                    <EmptyState searchQuery={searchQuery} />
                ) : (
                    <div className="space-y-8">
                        {/* Search and Filter */}
                        <ArticleSearchFilter
                            searchQuery={searchQuery}
                            sortBy={sortBy}
                            totalResults={totalCount ?? 0}
                        />

                        {/* Articles Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/*  eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(articles ?? []).map((article: any) => (
                                <ArticleCardEnhanced
                                    key={article.id}
                                    article={article}
                                    variant="default"
                                    className="h-full" // Ensure consistent height
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {(totalPages ?? 0) > 1 && (
                            <ArticlePagination
                                currentPage={currentPage}
                                totalPages={totalPages ?? 0}
                                hasNextPage={hasNextPage ?? false}
                                hasPrevPage={hasPrevPage ?? false}
                                searchParams={params} // Pass awaited params
                            />
                        )}

                        {/* Results Info */}
                        <div className="text-center text-sm text-muted-foreground">
                            Menampilkan {((currentPage - 1) * ARTICLES_PER_PAGE) + 1} - {Math.min(currentPage * ARTICLES_PER_PAGE, totalCount ?? 0)} dari {totalCount ?? 0} artikel
                        </div>
                    </div>
                )}
            </div>
        </Suspense>
    );
}

function EmptyState({ searchQuery }: { searchQuery?: string }) {
    return (
        <div className="text-center py-16">
            <div className="text-6xl mb-6">
                {searchQuery ? "🔍" : "📝"}
            </div>
            <h3 className="text-2xl font-semibold mb-4">
                {searchQuery ? "Artikel Tidak Ditemukan" : "Belum Ada Artikel"}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
                {searchQuery
                    ? `Tidak ada artikel yang cocok dengan pencarian "${searchQuery}". Coba kata kunci lain atau lihat semua artikel.`
                    : "Artikel akan segera hadir. Pantau terus untuk mendapatkan konten menarik tentang seni tari dan budaya Indonesia!"
                }
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                {searchQuery ? (
                    <Button asChild>
                        <Link href="/artikel">Lihat Semua Artikel</Link>
                    </Button>
                ) : (
                    <>
                        <Button asChild>
                            <Link href="/kontak">Hubungi Kami</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/galeri">Lihat Galeri</Link>
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

function ErrorState() {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h3 className="text-2xl font-semibold mb-4">Terjadi Kesalahan</h3>
            <p className="text-muted-foreground mb-8">
                Maaf, terjadi kesalahan saat memuat artikel. Silakan coba lagi.
            </p>
            <Button onClick={() => window.location.reload()}>
                Muat Ulang
            </Button>
        </div>
    );
}

;

function ArticleListSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <Skeleton className="h-10 w-full max-w-md" />
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-48 w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}