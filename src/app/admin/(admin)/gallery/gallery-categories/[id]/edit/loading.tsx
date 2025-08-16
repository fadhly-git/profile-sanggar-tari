import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function EditCategoryLoading() {
    return (
        <div className="container mx-auto py-6">
            <div className="max-w-2xl mx-auto">
                {/* Header Skeleton */}
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-8 w-20" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-80" />
                    </div>
                </div>

                {/* Form Card Skeleton */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className="h-6 w-40" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Title Input */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        {/* Slug Input */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-3 w-64" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-24 w-full" />
                        </div>

                        {/* Order */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        {/* Switch */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-10" />
                            <Skeleton className="h-4 w-24" />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-20" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}