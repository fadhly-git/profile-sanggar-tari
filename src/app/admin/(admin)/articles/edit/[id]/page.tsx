import { ArtikelForm } from '@/components/admin/articles/artikel-form'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { getArticleById, updateArticle } from '@/lib/actions/articles-action'
import { ArticleStatus } from '@prisma/client'

interface EditArtikelPageProps {
  params: Promise<{ id: string }>
}

async function handleUpdateArticle(formData: FormData) {
  'use server'

  const articleData = {
    id: formData.get('id') as string,
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    excerpt: (formData.get('excerpt') as string) || null,
    content: formData.get('content') as string,
    featuredImage: (formData.get('featuredImage') as string) || null,
    status: formData.get('status') as ArticleStatus,
    authorId: formData.get('authorId') as string,
    createdAt: new Date(), // Will be overridden by existing data
    updatedAt: new Date(),
    publishedAt: null, // Will be handled by updateArticle function
  }

  return await updateArticle(articleData)
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
  const fixedArticle = {
    ...article,
    excerpt: article.excerpt ?? undefined,
    featuredImage: article.featuredImage ?? undefined
  }

  return (
    <ArtikelForm
      authorId={session.user.id}
      article={fixedArticle}
      onSubmit={handleUpdateArticle}
    />
  )
}