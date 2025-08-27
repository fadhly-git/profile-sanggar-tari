// @/app/admin/gallery/edit/[id]/page.tsx
import { notFound } from 'next/navigation'
import { GalleryForm } from '@/components/admin/gallery/gallery-form'
import { getGalleryItemById } from '@/lib/actions/gallery-actions'
import { authOptions } from '@/lib/auth-options'
import { getServerSession } from 'next-auth'
import { getActiveGalleryCategories } from '@/lib/actions/gallery-category-actions'

interface EditGalleryPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditGalleryPage({ params }: EditGalleryPageProps) {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!session?.user?.id) {
        return <div>Unauthorized</div>
    }

    const [item, categories] = await Promise.all([
        getGalleryItemById(id),
        getActiveGalleryCategories()  // Fetch kategori aktif
    ])
    if (!item.success || !item.data) {
        notFound()
    }

    return <GalleryForm mode="edit" item={item.data} userId={session.user.id} categories={categories} />
}