import { ArtikelForm } from '@/components/admin/articles/artikel-form'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { createArticle } from '@/lib/actions/articles-action'
import { ArticleStatus } from '@prisma/client'

async function handleCreateArticle(formData: FormData) {
  'use server'
  
  const data = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    excerpt: formData.get('excerpt') as string || undefined,
    content: formData.get('content') as string,
    featuredImage: formData.get('featuredImage') as string || undefined,
    status: formData.get('status') as ArticleStatus,
    authorId: formData.get('authorId') as string,
  }
  
  return await createArticle(data)
}

export default async function BuatArtikelPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Unauthorized</div>
  }

  return <ArtikelForm authorId={session.user.id} onSubmit={handleCreateArticle} />
}