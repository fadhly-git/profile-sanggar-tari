// @/components/admin/gallery/gallery-context-menu.tsx
'use client'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { GalleryItem } from '@/types/gallery'

interface GalleryContextMenuProps {
  item: GalleryItem
  children: React.ReactNode
  onView: (item: GalleryItem) => void
  onEdit: (item: GalleryItem) => void
  onDelete: (item: GalleryItem) => void
}

export function GalleryContextMenu({ item, children, onView, onEdit, onDelete }: GalleryContextMenuProps) {
  return (
    <ContextMenu key={item.id}>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => onView(item)}>
          <Eye className="mr-2 h-4 w-4" />
          Lihat Detail
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onEdit(item)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem 
          onClick={() => onDelete(item)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}