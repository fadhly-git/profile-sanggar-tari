// src/components/admin/artikel/artikel-columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate, getStatusLabel, getStatusVariant } from "@/lib/utils"
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react"
import Image from "next/image"

export type Article = {
    id: string
    title: string
    slug: string
    excerpt?: string
    content: string
    featuredImage?: string
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    publishedAt?: Date | null
    createdAt: Date
    updatedAt: Date
    author: {
        id: string
        name: string
    }
}

interface CreateColumnsProps {
    onView: (id: string) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export const createColumns = ({ onView, onEdit, onDelete }: CreateColumnsProps): ColumnDef<Article>[] => [
    {
        accessorKey: "featuredImage",
        header: "Gambar",
        cell: ({ row }) => {
            const image = row.getValue("featuredImage") as string
            if (!image) return <div className="w-12 h-12 bg-muted rounded-md" />

            return (
                <Image
                    src={image}
                    alt={row.original.title}
                    width={48}
                    height={48}
                    className="rounded-md object-cover"
                />
            )
        },
        enableSorting: false,
    },
    {
        accessorKey: "title",
        header: "Judul",
        cell: ({ row }) => {
            const title = row.getValue("title") as string
            const excerpt = row.original.excerpt

            return (
                <div className="min-w-0">
                    <div className="font-medium line-clamp-1 truncated">{title}</div>
                    {excerpt && (
                        <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {excerpt}
                        </div>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={getStatusVariant(status)}>
                    {getStatusLabel(status)}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "author",
        header: "Penulis",
        cell: ({ row }) => {
            const author = row.getValue("author") as { name: string }
            return <div className="font-medium">{author.name}</div>
        },
    },
    {
        accessorKey: "publishedAt",
        header: "Tanggal",
        cell: ({ row }) => {
            const publishedAt = row.getValue("publishedAt") as Date
            const createdAt = row.original.createdAt
            const date = publishedAt || createdAt

            return (
                <div className="text-sm">
                    <div>{formatDate(date)}</div>
                    <div className="text-muted-foreground">
                        {publishedAt ? 'Dipublikasi' : 'Dibuat'}
                    </div>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const article = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onView(article.id)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(article.id)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(article.id)}
                            className="cursor-pointer text-destructive focus:text-destructive"
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