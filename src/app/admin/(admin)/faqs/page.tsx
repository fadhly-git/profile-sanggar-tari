import { Suspense } from 'react'
import { getFAQs } from '@/lib/actions/faq-actions'
import { FAQManagement } from '@/components/admin/faq/faq-management'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function FAQSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

async function FAQContent() {
  const result = await getFAQs()

  if (!result.success) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <p>Gagal memuat data FAQ: {result.error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <FAQManagement initialData={result.data ?? []} />
}

export default function FAQAdminPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Kelola FAQ
          </h1>
          <p className="text-muted-foreground mt-2">
            Kelola pertanyaan yang sering ditanyakan untuk membantu pengguna
          </p>
        </div>

        <Suspense fallback={<FAQSkeleton />}>
          <FAQContent />
        </Suspense>
      </div>
    </div>
  )
}