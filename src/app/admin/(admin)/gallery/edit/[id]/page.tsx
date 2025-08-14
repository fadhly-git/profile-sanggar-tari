// @/app/admin/gallery/edit/[id]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { GalleryForm } from '@/components/admin/gallery/gallery-form'
import { getGalleryItemById } from '@/lib/actions/gallery-actions'
import { authOptions } from '@/lib/auth-options'
import { getServerSession } from 'next-auth'

interface EditGalleryPageProps {
    params: {
        id: string
    }
}

export default async function EditGalleryPage({ params }: EditGalleryPageProps) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return <div>Unauthorized</div>
    }

    const result = await getGalleryItemById(params.id)

    if (!result.success || !result.data) {
        notFound()
    }

    return <GalleryForm mode="edit" item={result.data} userId={session.user.id} />
}