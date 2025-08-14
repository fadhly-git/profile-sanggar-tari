// src/app/admin/articles/create/page.tsx
import { ArtikelForm } from '@/components/admin/articles/artikel-form'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export default async function BuatArtikelPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Unauthorized</div>
  }

  return <ArtikelForm authorId={session.user.id} />
}