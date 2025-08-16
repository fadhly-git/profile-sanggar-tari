// @/app/admin/gallery/create/page.tsx
import { GalleryForm } from '@/components/admin/gallery/gallery-form'
import { getActiveGalleryCategories } from '@/lib/actions/gallery-category-actions'
import { authOptions } from '@/lib/auth-options'
import { getServerSession } from 'next-auth'

export default async function CreateGalleryPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return <div>Unauthorized</div>
    }

    const [categories] = await Promise.all([
        getActiveGalleryCategories()  // Fetch kategori aktif
    ])

    return <GalleryForm mode="create" userId={session.user.id} categories={categories} />
}