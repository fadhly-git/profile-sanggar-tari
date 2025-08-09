"use client"

import { Eye, Edit, Trash } from "lucide-react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

interface TableActionsMenuProps {
  children: React.ReactNode
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function TableActionsMenu({ children, onView, onEdit, onDelete }: TableActionsMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onView}>
          <Eye className="mr-2 h-4 w-4" />
          Lihat Detail
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} className="text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          Hapus
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}