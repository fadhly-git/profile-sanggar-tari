import React from 'react';
import { RecentArticle } from '@/types/dashboard';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface RecentArticlesProps {
  articles: RecentArticle[];
  loading?: boolean;
}

const RecentArticles: React.FC<RecentArticlesProps> = ({ articles, loading = false }) => {
  const getStatusBadge = (status: string) => {
    const statusClasses = {
      PUBLISHED: 'bg-green-100 text-green-800',
      DRAFT: 'bg-gray-100 text-gray-800',
      ARCHIVED: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status === 'PUBLISHED' ? 'Published' : status === 'DRAFT' ? 'Draft' : 'Archived'}
      </span>
    );
  };

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex items-center">
              <span>Artikel Terbaru</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <div className="mb-2">
                    <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                  </div>
                  <div>
                    <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
                  <div className="h-6 w-10 rounded bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artikel Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        {articles.length === 0 ? (
          <div className="text-center py-8">
            <CardDescription>Belum ada artikel</CardDescription>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="flex items-center justify-between py-3 hover:bg-background/90 rounded-lg px-3 -mx-3">
                <div className="flex-1">
                  <h4 className="text-sm font-medium mb-1">{article.title}</h4>
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span>By {article.author.name}</span>
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  {getStatusBadge(article.status)}
                  <CardAction>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Edit
                    </button>
                  </CardAction>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentArticles;