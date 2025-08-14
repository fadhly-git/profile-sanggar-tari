// @/components/admin/gallery/gallery-columns.tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { GalleryItem } from '@/types/gallery'
import { Eye, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'

interface ColumnProps {
  onView: (item: GalleryItem) => void
  onEdit: (item: GalleryItem) => void
  onDelete: (item: GalleryItem) => void
}

export const createGalleryColumns = ({ onView, onEdit, onDelete }: ColumnProps): ColumnDef<GalleryItem>[] => [
  {
    accessorKey: 'imageUrl',
    header: 'Gambar',
    cell: ({ row }) => {
      const imageUrl = row.getValue('imageUrl') as string
      return (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={imageUrl}
            alt={row.original.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.png'
            }}
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'title',
    header: 'Judul',
    cell: ({ row }) => {
      const title = row.getValue('title') as string
      return (
        <div className="max-w-[200px]">
          <p className="font-medium truncate">{title}</p>
          {row.original.category && (
            <Badge variant="secondary" className="mt-1 text-xs">
              {row.original.category}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'type',
    header: 'Tipe',
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      return (
        <Badge variant={type === 'IMAGE' ? 'default' : 'outline'}>
          {type === 'IMAGE' ? 'Gambar' : 'Video'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Aktif' : 'Nonaktif'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'author',
    header: 'Penulis',
    cell: ({ row }) => {
      const author = row.getValue('author') as GalleryItem['author']
      return <span className="text-sm">{author.name}</span>
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Dibuat',
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as Date
      return (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: idLocale })}
        </span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const item = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
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
      )
    },
  },
]