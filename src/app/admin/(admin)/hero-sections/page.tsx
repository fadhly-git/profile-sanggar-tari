import { Suspense } from 'react'
import { getHeroSections } from '@/lib/actions/hero-section-actions'
import { HeroSectionClient } from '@/components/admin/hero-section/hero-section-client'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function HeroSectionSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-16 w-24 rounded-md" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-8 w-8" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

async function HeroSectionContent() {
    const heroSections = await getHeroSections()

    return <HeroSectionClient initialData={heroSections} />
}

export default function HeroSectionsPage() {
    return (
        <div className="container mx-auto px-4 py-6">
            <Suspense fallback={<HeroSectionSkeleton />}>
                <HeroSectionContent />
            </Suspense>
        </div>
    )
}