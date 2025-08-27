// @/components/molecules/article-search-filter.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Calendar, TrendingUp, Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ArticleSearchFilterProps {
    searchQuery: string;
    sortBy: string;
    totalResults: number;
}

export function ArticleSearchFilter({
    searchQuery,
    sortBy,
    totalResults
}: ArticleSearchFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [localSearch, setLocalSearch] = useState(searchQuery);

    const updateSearchParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        // Reset page saat search atau sort berubah
        if (updates.q !== undefined || updates.sort !== undefined) {
            params.delete("page");
        }

        const queryString = params.toString();
        const newUrl = `/artikel${queryString ? `?${queryString}` : ''}`;

        startTransition(() => {
            router.push(newUrl);
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSearchParams({ q: localSearch.trim() });
    };

    const clearSearch = () => {
        setLocalSearch("");
        updateSearchParams({ q: null });
    };

    const handleSort = (sort: string) => {
        updateSearchParams({ sort: sort === 'newest' ? null : sort });
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    type="text"
                    placeholder="Cari artikel berdasarkan judul, konten, atau penulis..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isPending}
                />
                {localSearch && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                        disabled={isPending}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </form>

            {/* Filters and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                    <Select
                        value={sortBy}
                        onValueChange={handleSort}
                        disabled={isPending}
                    >
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Urutkan berdasarkan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Terbaru
                                </div>
                            </SelectItem>
                            <SelectItem value="oldest">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Terlama
                                </div>
                            </SelectItem>
                            <SelectItem value="title">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    Judul A-Z
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {searchQuery && (
                        <Badge variant="secondary" className="px-3 py-1">
                            Pencarian: &quot;{searchQuery}&quot;
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearSearch}
                                disabled={isPending}
                                className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}

                    {isPending && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Memuat...</span>
                        </div>
                    )}
                </div>

                {totalResults > 0 && (
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {totalResults} artikel ditemukan
                    </div>
                )}
            </div>
        </div>
    );
}