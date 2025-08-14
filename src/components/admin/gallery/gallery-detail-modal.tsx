// @/components/admin/gallery/gallery-detail-modal.tsx
'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow, format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { GalleryItem } from '@/types/gallery'
import Image from 'next/image'

interface GalleryDetailModalProps {
    item: GalleryItem | null
    open: boolean
    onClose: () => void
}

export function GalleryDetailModal({ item, open, onClose }: GalleryDetailModalProps) {
    if (!item) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detail Item Galeri</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="w-full max-h-96 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.png'
                            }}
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            {item.description && (
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant={item.type === 'IMAGE' ? 'default' : 'outline'}>
                                {item.type === 'IMAGE' ? 'Gambar' : 'Video'}
                            </Badge>
                            <Badge variant={item.isActive ? 'default' : 'secondary'}>
                                {item.isActive ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                            {item.category && (
                                <Badge variant="secondary">
                                    {item.category}
                                </Badge>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Penulis</p>
                                <p className="text-sm">{item.author.name}</p>
                                <p className="text-xs text-muted-foreground">{item.author.email}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Tanggal Dibuat</p>
                                <p className="text-sm">{format(new Date(item.createdAt), 'dd MMMM yyyy, HH:mm', { locale: idLocale })}</p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: idLocale })}
                                </p>
                            </div>

                            {item.updatedAt !== item.createdAt && (
                                <div className="md:col-span-2">
                                    <p className="text-sm font-medium text-muted-foreground">Terakhir Diperbarui</p>
                                    <p className="text-sm">{format(new Date(item.updatedAt), 'dd MMMM yyyy, HH:mm', { locale: idLocale })}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true, locale: idLocale })}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-sm font-medium text-muted-foreground mb-1">URL Gambar</p>
                            <p className="text-xs text-muted-foreground break-all bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                {item.imageUrl}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}