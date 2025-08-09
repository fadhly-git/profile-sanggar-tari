import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Dependency {
    categoryId: string
    categoryName: string
    beritaCount: number
    halamanCount: number
}

interface DependencyListProps {
    dependencies: Dependency[]
}

export function DependencyList({ dependencies }: DependencyListProps) {
    if (dependencies.length === 0) return null

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-medium">Kategori yang Terpengaruh:</h4>
            <ScrollArea className="max-h-32 w-full">
                <div className="space-y-2">
                    {dependencies.map((dep) => (
                        <div
                            key={dep.categoryId}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-muted rounded gap-2"
                        >
                            <span className="text-sm font-medium break-words">
                                {dep.categoryName}
                            </span>
                            <div className="flex gap-2 flex-wrap">
                                {dep.beritaCount > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        {dep.beritaCount} berita
                                    </Badge>
                                )}
                                {dep.halamanCount > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        {dep.halamanCount} halaman
                                    </Badge>
                                )}
                                {/* ✅ Show badge untuk child category tanpa content */}
                                {dep.beritaCount === 0 && dep.halamanCount === 0 && (
                                    <Badge variant="outline" className="text-xs">
                                        Sub kategori
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}