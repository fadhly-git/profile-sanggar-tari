// @/app/(public)/artikel/article-list.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArticleCardEnhanced } from "@/components/molecules/article-card-enhanced";
import { ArticleSearchFilter } from "@/components/molecules/article-search-filter";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Article {
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
}

interface ArticleListProps {
  initialArticles: Article[];
  searchParams: { 
    q?: string; 
    sort?: string;
    page?: string;
  };
}

const ARTICLES_PER_PAGE = 9;

export default function ArticleList({ initialArticles, searchParams }: ArticleListProps) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  
  const searchQuery = searchParams.q || "";
  const sortBy = searchParams.sort || "newest";
  const currentPage = parseInt(searchParams.page || "1");

  // Filter dan sort articles
  const { filteredArticles, totalPages } = useMemo(() => {
    let filtered = [...initialArticles];

    // Filter berdasarkan search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.excerpt?.toLowerCase().includes(query) ||
        article.author?.name.toLowerCase().includes(query)
      );
    }

    // Sort articles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case "oldest":
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
    const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
    const paginatedArticles = filtered.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

    return {
      filteredArticles: paginatedArticles,
      totalArticles: filtered.length,
      totalPages
    };
  }, [initialArticles, searchQuery, sortBy, currentPage]);

  const updateSearchParams = (updates: Record<string, string | null>) => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParamsHook.toString());
    
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

    router.push(`/artikel?${params.toString()}`, { scroll: false });
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleSearch = (query: string) => {
    updateSearchParams({ q: query });
  };

  const handleSort = (sort: string) => {
    updateSearchParams({ sort });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() });
  };

  return (
    <div className="space-y-8">
      {/* Search and Filter */}
      <ArticleSearchFilter
        onSearch={handleSearch}
        onSort={handleSort}
        searchQuery={searchQuery}
        sortBy={sortBy}
        totalResults={initialArticles.length}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Articles Grid */}
      {!isLoading && (
        <>
          {filteredArticles.length === 0 ? (
            <NoResultsFound searchQuery={searchQuery} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCardEnhanced
                  key={article.id}
                  article={article}
                  variant="default"
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

function NoResultsFound({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold mb-2">
        {searchQuery ? "Artikel Tidak Ditemukan" : "Tidak Ada Artikel"}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {searchQuery 
          ? `Tidak ada artikel yang cocok dengan pencarian "${searchQuery}". Coba kata kunci lain.`
          : "Belum ada artikel lainnya. Artikel baru akan segera hadir!"
        }
      </p>
      {searchQuery && (
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/artikel'}
        >
          Lihat Semua Artikel
        </Button>
      )}
    </div>
  );
}

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void; 
}) {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    const end = Math.min(totalPages, start + showPages - 1);

    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Sebelumnya
      </Button>
      
      {getPageNumbers().map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className="min-w-10"
        >
          {page}
        </Button>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Selanjutnya
      </Button>
    </div>
  );
}