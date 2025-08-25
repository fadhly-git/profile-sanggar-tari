import { notFound } from "next/navigation"
import { getPageContentById } from "@/lib/page-content/actions"
import { PageContentForm } from "@/components/admin/page-content/page-content-form"

interface EditPageContentPageProps {
    params: Promise<{ id: string }>
}

export default async function EditPageContentPage({ params }: EditPageContentPageProps) {
    const resolvedParams = await params
    const { id } = resolvedParams
    const result = await getPageContentById(id)
    console.log('Fetch Result:', result)

    if (!result.success || !result.data) {
        notFound()
    }

    return <PageContentForm mode="edit" initialData={result.data} />
}