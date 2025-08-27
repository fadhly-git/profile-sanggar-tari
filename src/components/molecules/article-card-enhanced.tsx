// @/components/molecules/article-card-enhanced.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDateRelative, truncateText, estimateReadingTime } from "@/lib/utils";

interface ArticleCardProps {
    article: {
        id: string;
        title: string;
        slug: string;
        excerpt?: string;
        content: string;
        featuredImage?: string;
        publishedAt: string;
        author?: {
            name: string;
        };
    };
    variant?: "default" | "featured" | "compact";
    showAuthor?: boolean;
    showReadTime?: boolean;
    className?: string;
}

export function ArticleCardEnhanced({
    article,
    variant = "default",
    showAuthor = true,
    showReadTime = true,
    className = ""
}: ArticleCardProps) {
    const readingTime = estimateReadingTime(article.content);

    if (variant === "featured") {
        return (
            <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 group ${className}`}>
                <div className="relative h-64 md:h-80 overflow-hidden">
                    <Image
                        src={article.featuredImage || "/uploads/default-article.jpg"}
                        alt={article.title}
                        fill
                        sizes="100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-primary-foreground">
                            Artikel Utama
                        </Badge>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white backdrop-blur-sm">
                        <div className="flex items-center gap-4 text-sm mb-3 opacity-90">
                            {showAuthor && article.author && (
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>{article.author.name}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDateRelative(article.publishedAt)}</span>
                            </div>
                            {showReadTime && (
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{readingTime} menit baca</span>
                                </div>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold mb-3 leading-tight">
                            <Link
                                href={`/artikel/${article.slug}`}
                                className="hover:text-primary/90 transition-colors"
                            >
                                {article.title}
                            </Link>
                        </h2>

                        {article.excerpt && (
                            <p className="text-white/80 mb-4 line-clamp-2">
                                {article.excerpt}
                            </p>
                        )}

                        <Link href={`/artikel/${article.slug}`}>
                            <Button variant="secondary" className="group/btn hover:cursor-pointer">
                                Baca Selengkapnya
                                <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        );
    }

    if (variant === "compact") {
        return (
            <Card className={`overflow-hidden hover:shadow-lg transition-shadow group ${className}`}>
                <div className="flex mx-3">
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-xl">
                        <Image
                            src={article.featuredImage || "/uploads/default-article.jpg"}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-md"
                        />
                    </div>
                    <div className="flex-1 p-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDateRelative(article.publishedAt)}</span>
                            {showReadTime && (
                                <>
                                    <span>•</span>
                                    <Clock className="h-3 w-3" />
                                    <span>{readingTime} menit</span>
                                </>
                            )}
                        </div>
                        <h3 className="font-semibold line-clamp-2 text-sm mb-1 group-hover:text-primary transition-colors">
                            <Link href={`/artikel/${article.slug}`}>
                                {article.title}
                            </Link>
                        </h3>
                        {article.excerpt && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {truncateText(article.excerpt, 80)}
                            </p>
                        )}
                    </div>
                </div>
            </Card>
        );
    }

    // Default variant
    return (
        <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 group ${className}`}>
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={article.featuredImage || "/uploads/default-article.jpg"}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <CardHeader className="pb-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    {showAuthor && article.author && (
                        <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{article.author.name}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDateRelative(article.publishedAt)}</span>
                    </div>
                    {showReadTime && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{readingTime} menit</span>
                        </div>
                    )}
                </div>

                <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                    <Link href={`/artikel/${article.slug}`}>
                        {article.title}
                    </Link>
                </h3>
            </CardHeader>

            <CardContent className="pt-0">
                {article.excerpt && (
                    <p className="text-muted-foreground line-clamp-3 mb-4 leading-relaxed text-base">
                        {article.excerpt}
                    </p>
                )}

                <Link href={`/artikel/${article.slug}`}>
                    <Button variant="ghost" className="p-0 h-auto font-medium group/btn cursor-pointer">
                        Baca Selengkapnya
                        <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}