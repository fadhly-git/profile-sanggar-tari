import { notFound } from 'next/navigation'
import { GalleryCategoryForm } from '@/components/admin/gallery/category/gallery-category-form'
import { getGalleryCategoryById } from '@/lib/actions/gallery-category-actions'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

interface EditGalleryCategoryPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditGalleryCategoryPage({
    params
}: EditGalleryCategoryPageProps) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return <div>Unauthorized</div>
    }
    const category = await getGalleryCategoryById(id)

    if (!category) {
        notFound()
    }

    return <GalleryCategoryForm mode="edit" category={category} userId={session.user.id} />
}