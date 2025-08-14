// @/components/admin/gallery/gallery-mobile-card.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { GalleryItem } from '@/types/gallery'
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GalleryContextMenu } from './gallery-context-menu'
import Image from 'next/image'

interface GalleryMobileCardProps {
    item: GalleryItem
    onView: (item: GalleryItem) => void
    onEdit: (item: GalleryItem) => void
    onDelete: (item: GalleryItem) => void
}

export function GalleryMobileCard({ item, onView, onEdit, onDelete }: GalleryMobileCardProps) {
    return (
        <GalleryContextMenu
            item={item}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
        >
            <Card className="w-full">
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            <Image
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder-image.png'
                                }}
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm leading-5 mb-2 truncate">
                                        {item.title}
                                    </h3>

                                    <div className="flex flex-wrap gap-1 mb-2">
                                        <Badge variant={item.type === 'IMAGE' ? 'default' : 'outline'} className="text-xs">
                                            {item.type === 'IMAGE' ? 'Gambar' : 'Video'}
                                        </Badge>
                                        <Badge variant={item.isActive ? 'default' : 'secondary'} className="text-xs">
                                            {item.isActive ? 'Aktif' : 'Nonaktif'}
                                        </Badge>
                                        {item.category && (
                                            <Badge variant="secondary" className="text-xs">
                                                {item.category}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        <p>Oleh: {item.author.name}</p>
                                        <p>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: idLocale })}</p>
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onView(item)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Lihat Detail
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onEdit(item)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => onDelete(item)}
                                            className="text-red-600 focus:text-red-600"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </GalleryContextMenu>
    )
}