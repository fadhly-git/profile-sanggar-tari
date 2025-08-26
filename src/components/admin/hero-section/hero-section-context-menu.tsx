'use client'

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Eye, Pencil, Trash2 } from 'lucide-react'

interface HeroSection {
    id: string
    imageUrl: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

interface HeroSectionContextMenuProps {
    children: React.ReactNode
    heroSection: HeroSection
    onView: (heroSection: HeroSection) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export function HeroSectionContextMenu({
    children,
    heroSection,
    onView,
    onEdit,
    onDelete
}: HeroSectionContextMenuProps) {
    return (
        <ContextMenu key={heroSection.id}>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => onView(heroSection)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onEdit(heroSection.id)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={() => onDelete(heroSection.id)}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}