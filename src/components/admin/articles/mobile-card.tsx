// src/components/admin/layout/mobile-card.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { formatDate, getStatusLabel, getStatusVariant } from '@/lib/utils'
import { Eye, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface MobileCardProps {
    article: {
        id: string
        title: string
        excerpt?: string
        featuredImage?: string
        status: string
        publishedAt?: Date | null
        createdAt: Date
        author: {
            name: string
        }
    }
    onView: (id: string) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export function MobileCard({ article, onView, onEdit, onDelete }: MobileCardProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <Card className="w-full cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                                    {article.title}
                                </h3>
                                <Badge variant={getStatusVariant(article.status)} className="text-xs">
                                    {getStatusLabel(article.status)}
                                </Badge>
                            </div>
                            {article.featuredImage && (
                                <div className="ml-3 flex-shrink-0">
                                    <Image
                                        src={article.featuredImage}
                                        alt={article.title}
                                        width={60}
                                        height={60}
                                        className="rounded-md object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {article.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {article.excerpt}
                            </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Oleh {article.author.name}</span>
                            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                        </div>
                    </CardContent>
                </Card>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => onView(article.id)} className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onEdit(article.id)} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={() => onDelete(article.id)}
                    className="cursor-pointer text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}