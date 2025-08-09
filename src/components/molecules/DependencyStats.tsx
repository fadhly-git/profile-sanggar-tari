import { Card, CardContent } from "@/components/ui/card"
import { FolderTree, FileText, Database } from "lucide-react"

interface DependencyStatsProps {
    affectedCategories: number
    totalBerita: number
    totalHalaman: number
}

export function DependencyStats({
    affectedCategories,
    totalBerita,
    totalHalaman
}: DependencyStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
                <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                        <FolderTree className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium">Kategori</p>
                            <p className="text-lg sm:text-2xl font-bold">{affectedCategories}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium">Berita</p>
                            <p className="text-lg sm:text-2xl font-bold">{totalBerita}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium">Halaman</p>
                            <p className="text-lg sm:text-2xl font-bold">{totalHalaman}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}