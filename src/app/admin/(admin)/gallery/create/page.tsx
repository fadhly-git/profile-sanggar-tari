// @/app/admin/gallery/create/page.tsx
import { GalleryForm } from '@/components/admin/gallery/gallery-form'
import { authOptions } from '@/lib/auth-options'
import { getServerSession } from 'next-auth'

export default async function CreateGalleryPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return <div>Unauthorized</div>
    }

    return <GalleryForm mode="create" userId={session.user.id} />
}