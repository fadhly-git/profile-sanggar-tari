'use client'

import { ColumnDef } from '@tanstack/react-table'
import { BadgeStatus } from '@/components/atoms/badge-status'
import { Button } from '@/components/ui/button'
import { Eye, Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'

export interface HeroSection {
    id: string
    imageUrl: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

interface ActionsProps {
    heroSection: HeroSection
    onView: (heroSection: HeroSection) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

function Actions({ heroSection, onView, onEdit, onDelete }: ActionsProps) {
    return (
        <DropdownMenu key={heroSection.id}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Buka menu</span>
                    <MoreHorizontal className="h-4 w-4" />
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
    )
}

export function createColumns(
    onView: (heroSection: HeroSection) => void,
    onEdit: (id: string) => void,
    onDelete: (id: string) => void
): ColumnDef<HeroSection>[] {
    return [
        {
            accessorKey: 'imageUrl',
            header: 'Gambar',
            cell: ({ row }) => (
                <div className="relative h-16 w-24 overflow-hidden rounded-md">
                    <Image
                        src={row.original.imageUrl}
                        alt="Hero Section"
                        fill
                        className="object-cover"
                    />
                </div>
            ),
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => (
                <BadgeStatus status={row.original.isActive ? 'success' : 'danger'}>
                    {row.original.isActive ? 'Aktif' : 'Tidak Aktif'}
                </BadgeStatus>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Dibuat',
            cell: ({ row }) => (
                <span className="text-sm">
                    {new Date(row.original.createdAt).toLocaleDateString('id-ID')}
                </span>
            ),
        },
        {
            accessorKey: 'updatedAt',
            header: 'Diperbarui',
            cell: ({ row }) => (
                <span className="text-sm">
                    {new Date(row.original.updatedAt).toLocaleDateString('id-ID')}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <Actions
                    heroSection={row.original}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ),
        },
    ]
}