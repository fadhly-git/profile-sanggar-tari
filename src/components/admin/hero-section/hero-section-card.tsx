'use client'

import { Card, CardContent } from '@/components/ui/card'
import { BadgeStatus } from '@/components/atoms/badge-status'
import { Button } from '@/components/ui/button'
import { Eye, Pencil, Trash2, MoreVertical } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

export interface HeroSection {
    id: string
    imageUrl: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

interface HeroSectionCardProps {
    heroSection: HeroSection
    onView: (heroSection: HeroSection) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export function HeroSectionCard({
    heroSection,
    onView,
    onEdit,
    onDelete
}: HeroSectionCardProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-3">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                        <Image
                            src={heroSection.imageUrl}
                            alt="Hero Section"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <BadgeStatus status={heroSection.isActive ? 'success' : 'danger'}>
                            {heroSection.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </BadgeStatus>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onView(heroSection)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Lihat Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onEdit(heroSection.id)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onDelete(heroSection.id)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Dibuat:</span>
                            <span>{formatDate(heroSection.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Diperbarui:</span>
                            <span>{formatDate(heroSection.updatedAt)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}