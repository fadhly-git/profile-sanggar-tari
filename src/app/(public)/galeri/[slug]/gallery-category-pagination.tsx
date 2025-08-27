// @/app/(public)/galeri/[slug]/gallery-category-pagination.tsx
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface GalleryCategoryPaginationProps {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    categorySlug: string;
}

export default function GalleryCategoryPagination({
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    categorySlug
}: GalleryCategoryPaginationProps) {

    const createPageUrl = (page: number) => {
        if (page === 1) {
            return `/galeri/${categorySlug}`;
        }
        return `/galeri/${categorySlug}?page=${page}`;
    };

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...' as const);
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...' as const, totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Mobile Navigation */}
            <div className="flex sm:hidden items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasPrevPage}
                    asChild={hasPrevPage}
                >
                    {hasPrevPage ? (
                        <Link href={createPageUrl(currentPage - 1)}>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Sebelumnya
                        </Link>
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Sebelumnya
                        </>
                    )}
                </Button>

                <div className="flex items-center gap-2 px-4">
                    <span className="text-sm font-medium">{currentPage}</span>
                    <span className="text-sm text-muted-foreground">dari</span>
                    <span className="text-sm font-medium">{totalPages}</span>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasNextPage}
                    asChild={hasNextPage}
                >
                    {hasNextPage ? (
                        <Link href={createPageUrl(currentPage + 1)}>
                            Selanjutnya
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    ) : (
                        <>
                            Selanjutnya
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </>
                    )}
                </Button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-1">
                {/* Previous Button */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasPrevPage}
                    asChild={hasPrevPage}
                    className="mr-2"
                >
                    {hasPrevPage ? (
                        <Link href={createPageUrl(currentPage - 1)}>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Sebelumnya
                        </Link>
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Sebelumnya
                        </>
                    )}
                </Button>

                {/* Page Numbers */}
                {getVisiblePages().map((page, index) => {
                    if (page === '...') {
                        return (
                            <Button
                                key={`dots-${index}`}
                                variant="ghost"
                                size="sm"
                                disabled
                                className="w-10"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        );
                    }

                    const pageNumber = page as number;
                    const isActive = pageNumber === currentPage;

                    return (
                        <Button
                            key={pageNumber}
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            className="w-10"
                            asChild={!isActive}
                        >
                            {isActive ? (
                                pageNumber
                            ) : (
                                <Link href={createPageUrl(pageNumber)}>
                                    {pageNumber}
                                </Link>
                            )}
                        </Button>
                    );
                })}

                {/* Next Button */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasNextPage}
                    asChild={hasNextPage}
                    className="ml-2"
                >
                    {hasNextPage ? (
                        <Link href={createPageUrl(currentPage + 1)}>
                            Selanjutnya
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    ) : (
                        <>
                            Selanjutnya
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}