// @/app/(public)/artikel/[slug]/page.tsx
import "./article-styles.css";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug, getRecentArticles } from "@/lib/actions/articles-action";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar, User, ArrowLeft, Clock,  ChartBar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate, formatDateRelative, estimateReadingTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArticleCardEnhanced } from "@/components/molecules/article-card-enhanced";
import ShareButtons from "./share-buttons";
import ArticleEnhancements from "./article-enhancements";
import ScrollToTop from "./scroll-to-top";

interface ArticlePageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const articleResult = await getArticleBySlug(slug);

    if (!articleResult) {
        return {
            title: "Artikel Tidak Ditemukan - Sanggar Tari Ngesti Laras Budaya",
        };
    }
    const article = articleResult;

    return {
        title: `${article.title} - Sanggar Tari Ngesti Laras Budaya`,
        description: article.excerpt || `Baca artikel ${article.title} dari Sanggar Tari Ngesti Laras Budaya`,
        keywords: `sanggar tari, ngesti laras budaya, boja, meteseh boja, Kab. Kendal, seni tari, budaya, ${article.title}`,
        viewport: "width=device-width, initial-scale=1",
        robots: "index, follow",
        openGraph: {
            title: article.title,
            description: article.excerpt || "",
            url: `https://ngelaras.my.id/artikel/${article.slug}`,
            siteName: "Sanggar Tari Ngesti Laras Budaya",
            locale: "id_ID",
            type: "article",
            publishedTime: article.publishedAt ? article.publishedAt.toISOString() : undefined,
            authors: [article.author?.name || ""],
            images: article.featuredImage ? [
                {
                    url: article.featuredImage,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                }
            ] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.excerpt || "",
            images: article.featuredImage ? [article.featuredImage] : [],
        },
        alternates: {
            canonical: `https://ngelaras.my.id/artikel/${article.slug}`,
        },
    };
}

async function ArticlePage({ params }: ArticlePageProps) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const articleResult = await getArticleBySlug(slug);

    if (!articleResult) {
        notFound();
    }

    const article = articleResult;
    const readingTime = estimateReadingTime(article.content);

    // Ambil artikel terbaru lainnya
    const recentArticlesResult = await getRecentArticles(article.slug, 3);
    const recentArticles = recentArticlesResult?.success && Array.isArray(recentArticlesResult.data) ? recentArticlesResult.data : [];

    return (
        <>
            <ArticleEnhancements />
            {/* Hero Section with Breadcrumb */}
            <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
                <div className="container mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Link href="/artikel">
                            <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-primary transition-colors">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali ke Artikel
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-4 relative z-10 mb-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <article>
                            {/* Featured Image dengan Overlay */}
                            {article.featuredImage && (
                                <div className="relative h-64 md:h-96 lg:h-[28rem] rounded-2xl overflow-hidden mb-8 group">
                                    <Image
                                        src={article.featuredImage}
                                        alt={article.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                                    {/* Floating Category Badge */}
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-primary">
                                            Artikel Seni Tari
                                        </div>
                                    </div>

                                    {/* Reading Time Badge */}
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {readingTime} min
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Article Header dengan Design yang Lebih Menarik */}
                            <header className="mb-10">
                                <div className="space-y-6">
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                                        {article.title}
                                    </h1>

                                    {/* Article Meta dengan Design Card */}
                                    <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex flex-wrap items-center gap-6">
                                                {article.author && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md">
                                                            <User className="h-5 w-5 text-primary-foreground" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-sm">{article.author.name}</div>
                                                            <div className="text-xs text-muted-foreground">Kontributor</div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{formatDate(article.publishedAt ?? new Date())}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/50 px-3 py-1 rounded-lg">
                                                <Clock className="h-4 w-4" />
                                                <span>{readingTime} menit baca</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Excerpt dengan Design yang Lebih Menarik */}
                                    {article.excerpt && (
                                        <div className="relative">
                                            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
                                            <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-r-xl pl-6 pr-6 py-6 ml-4">
                                                <p className="text-lg leading-relaxed text-muted-foreground italic font-medium">
                                                    &quot;{article.excerpt}&quot;
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Share Buttons dengan Design yang Lebih Baik */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 border-t border-border/50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <span className="text-sm">📤</span>
                                            </div>
                                            <span className="text-sm font-medium">Bagikan artikel ini:</span>
                                        </div>
                                        <ShareButtons
                                            url={`https://ngelaras.my.id/artikel/${article.slug}`}
                                            title={article.title}
                                        />
                                    </div>
                                </div>
                            </header>

                            {/* Article Content dengan Typography yang Lebih Baik */}
                            <div className="relative">
                                {/* Progress Reading Bar */}
                                <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
                                    <div className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300" style={{ width: '0%' }} id="reading-progress"></div>
                                </div>

                                <div
                                    className="article-content prose prose-lg max-w-none 
                                prose-headings:font-bold prose-headings:text-foreground prose-headings:scroll-mt-20
                                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-base prose-p:mb-6
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                                prose-strong:text-foreground prose-strong:font-semibold
                                prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                                prose-li:mb-2 prose-li:leading-relaxed
                                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 
                                prose-blockquote:rounded-r-lg prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8
                                prose-blockquote:not-italic prose-blockquote:font-medium
                                prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                                prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg prose-pre:p-4
                                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                                prose-hr:border-border prose-hr:my-8
                                prose-table:text-sm prose-table:border-collapse
                                prose-th:bg-muted prose-th:font-semibold prose-th:p-3 prose-th:text-left
                                prose-td:p-3 prose-td:border-t prose-td:border-border"
                                    dangerouslySetInnerHTML={{ __html: article.content }}
                                />
                            </div>

                            {/* Article Footer dengan Design yang Lebih Menarik */}
                            <footer className="mt-16 pt-8 border-t border-border/50">
                                <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                        <div className="text-sm text-muted-foreground bg-background/50 px-3 py-2 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>Dipublikasikan {formatDateRelative(article.publishedAt ?? new Date())}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </footer>
                        </article>
                    </div>

                    {/* Sidebar dengan Design yang Lebih Menarik */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6 sticky top-18">

                            {/* Article Info Card */}
                            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                <CardTitle className="text-lg flex items-center gap-2 px-4">
                                    <span className="text-lg">
                                        <ChartBar className="h-5 w-5 text-primary" />
                                    </span>
                                    Info Artikel
                                </CardTitle>
                                <CardContent className="px-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                                <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">{readingTime} menit baca</div>
                                                <div className="text-xs text-muted-foreground">Estimasi waktu</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">{formatDate(article.publishedAt ?? new Date())}</div>
                                                <div className="text-xs text-muted-foreground">Tanggal publikasi</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions dengan Design yang Lebih Menarik */}
                            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                <CardTitle className="text-lg flex items-center gap-2 px-4">
                                    <span className="text-lg">⚡</span>
                                    Aksi Cepat
                                </CardTitle>
                                <CardContent className="px-4 space-y-3">
                                    <Button variant="outline" className="w-full justify-start gap-3 h-11 hover:bg-primary/5 hover:border-primary/20 transition-colors" asChild>
                                        <Link href="/kontak">
                                            <span className="text-base">📞</span>
                                            Hubungi Kami
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-3 h-11 hover:bg-primary/5 hover:border-primary/20 transition-colors" asChild>
                                        <Link href="/galeri">
                                            <span className="text-base">🖼️</span>
                                            Lihat Galeri
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-3 h-11 hover:bg-primary/5 hover:border-primary/20 transition-colors" asChild>
                                        <Link href="/tentang-kami">
                                            <span className="text-base">🏛️</span>
                                            Tentang Sanggar
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Related Articles dengan Design yang Lebih Menarik */}
                {recentArticles?.length > 0 && (
                    <section className="my-20 container mx-auto px-4">
                        <div className="relative">
                            <Separator className="mb-12" />
                            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 bg-background px-6">
                                <div className="w-3 h-3 bg-primary rounded-full"></div>
                            </div>
                        </div>

                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                                Artikel Terbaru Lainnya
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Jelajahi artikel menarik lainnya tentang seni tari dan budaya Indonesia
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {recentArticles.map((recentArticle: any) => (
                                <div key={recentArticle.id} className="group">
                                    <ArticleCardEnhanced
                                        article={recentArticle}
                                        variant="compact"
                                        showAuthor={false}
                                        className="h-full transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Button variant="outline" size="lg" className="bg-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 px-8" asChild>
                                <Link href="/artikel">
                                    <span className="mr-2">📚</span>
                                    Lihat Semua Artikel
                                </Link>
                            </Button>
                        </div>
                    </section>
                )}
            </div>
            {/* Scroll to Top Button */}
            <ScrollToTop />

        </>
    );
}

export default ArticlePage;