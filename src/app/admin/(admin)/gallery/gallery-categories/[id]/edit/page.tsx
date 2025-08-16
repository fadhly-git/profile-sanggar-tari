import { notFound } from 'next/navigation'
import { GalleryCategoryForm } from '@/components/admin/gallery/category/gallery-category-form'
import { getGalleryCategoryById } from '@/lib/actions/gallery-category-actions'

interface EditGalleryCategoryPageProps {
    params: {
        id: string
    }
}

export default async function EditGalleryCategoryPage({
    params
}: EditGalleryCategoryPageProps) {
    const category = await getGalleryCategoryById(params.id)

    if (!category) {
        notFound()
    }

    return <GalleryCategoryForm mode="edit" category={category} />
}