// src/components/admin/artikel/artikel-detail-modal.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { formatDate, getStatusLabel, getStatusVariant } from "@/lib/utils"
import { Article } from "./artikel-columns"
import Image from "next/image"

interface ArtikelDetailModalProps {
    article: Article | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ArtikelDetailModal({ article, open, onOpenChange }: ArtikelDetailModalProps) {
    if (!article) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detail Artikel</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {article.featuredImage && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                            <Image
                                src={article.featuredImage}
                                alt={article.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold">{article.title}</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Slug: {article.slug}
                            </p>
                        </div>

                        {article.excerpt && (
                            <div>
                                <h3 className="font-semibold mb-2">Ringkasan</h3>
                                <p className="text-muted-foreground">{article.excerpt}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold mb-2">Status</h3>
                                <Badge variant={getStatusVariant(article.status)}>
                                    {getStatusLabel(article.status)}
                                </Badge>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Penulis</h3>
                                <p>{article.author.name}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Dibuat</h3>
                                <p className="text-sm">{formatDate(article.createdAt)}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Diperbarui</h3>
                                <p className="text-sm">{formatDate(article.updatedAt)}</p>
                            </div>

                            {article.publishedAt && (
                                <div className="col-span-2">
                                    <h3 className="font-semibold mb-2">Dipublikasi</h3>
                                    <p className="text-sm">{formatDate(article.publishedAt)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}