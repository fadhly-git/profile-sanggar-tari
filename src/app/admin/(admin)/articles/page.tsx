// app/admin/articles/page.tsx
import { Suspense } from "react"
import { deleteArticle, getArticles } from "@/lib/actions/articles-action"
import { ArtikelListContent } from "@/components/admin/articles/artikel-list-content"
import { Skeleton } from "@/components/ui/skeleton"

function ArticlesLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}

export default async function ArticlesPage() {
  return (
    <div className="space-y-6">

      <Suspense fallback={<ArticlesLoading />}>
        <ArticlesData />
      </Suspense>
    </div>
  )
}

async function handleDeleteArticle(id: string) {
  'use server'
  return await deleteArticle(id)
}

async function ArticlesData() {
  const articlesRaw = await getArticles()
  const articles = articlesRaw.map(article => ({
    ...article,
    excerpt: article.excerpt === null ? undefined : article.excerpt,
    featuredImage: article.featuredImage === null ? undefined : article.featuredImage
  }))

  return <ArtikelListContent articles={articles} onDeleteArticle={handleDeleteArticle} />
}