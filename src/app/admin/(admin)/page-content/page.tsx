import { Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getPageContents } from "@/lib/page-content/actions"
import { PageContentTable } from "@/components/admin/page-content/page-content-table"
import { PageContentMobile } from "@/components/admin/page-content/page-content-mobile"

function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
            </div>
        </div>
    )
}

async function PageContentList() {
    const result = await getPageContents()

    if (!result.success) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Gagal memuat data konten halaman</p>
            </div>
        )
    }

    const data = result.data || []

    if (data.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Belum ada konten halaman</p>
                <Button asChild className="mt-4">
                    <Link href="/admin/page-content/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Konten Pertama
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block">
                <PageContentTable data={data} />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
                <PageContentMobile data={data} />
            </div>
        </>
    )
}

export default function PageContentPage() {
    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Konten Halaman</h1>
                    <p className="text-muted-foreground">
                        Kelola konten untuk halaman statis website
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/page-content/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Konten
                    </Link>
                </Button>
            </div>

            <Suspense fallback={<LoadingSkeleton />}>
                <PageContentList />
            </Suspense>
        </div>
    )
}