// src/app/admin/articles/create/page.tsx
import { ArtikelForm } from '@/components/admin/articles/artikel-form'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { getArticleById } from '@/lib/actions/articles-action'

interface EditArtikelPageProps {
  params: Promise<{ id: string }>
}

export default async function EditArtikelPage({ params }: EditArtikelPageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Unauthorized</div>
  }

  const article = await getArticleById(id)

  if (!article) {
    return <div>Article not found</div>
  }

  // Ensure excerpt is undefined if null to match Article type
  const fixedArticle = article ? { ...article, excerpt: article.excerpt ?? undefined, featuredImage: article.featuredImage ?? undefined } : undefined;
  return <ArtikelForm authorId={session.user.id} article={fixedArticle} />
}