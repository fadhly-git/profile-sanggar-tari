'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/molecules/data-table'
import { GalleryCategoryMobileCard } from '@/components/admin/gallery/category/gallery-category-mobile-card'
import { GalleryCategoryDetailModal } from '@/components/admin/gallery/category/gallery-category-detail-modal'
import { DeleteConfirmDialog } from '@/components/molecules/delete-confirm-dialog'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Plus, Eye, Edit, Trash2, ArrowUpDown } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { toast } from 'sonner'
import { getGalleryCategories, deleteGalleryCategory } from '@/lib/actions/gallery-category-actions'
interface GalleryCategoryWithAuthor {
    id: string
    title: string
    slug: string
    description: string | null
    order: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    authorId: string
    author: {
        id: string
        name: string
        email: string
    }
    _count: {
        items: number
    }
}

export default function GalleryCategoriesPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [categories, setCategories] = useState<GalleryCategoryWithAuthor[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<GalleryCategoryWithAuthor | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async () => {
        try {
            const data = await getGalleryCategories()
            setCategories(data as GalleryCategoryWithAuthor[])
        } catch (error) {
            toast.error('Gagal memuat data kategori')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleView = (category: GalleryCategoryWithAuthor) => {
        setSelectedCategory(category)
        setShowDetailModal(true)
    }

    const handleEdit = (id: string) => {
        router.push(`/admin/gallery/gallery-categories/${id}/edit`)
    }

    const handleDelete = (id: string) => {
        setCategoryToDelete(id)
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        if (!categoryToDelete) return

        startTransition(async () => {
            try {
                await deleteGalleryCategory(categoryToDelete)
                toast.success('Kategori berhasil dihapus')
                loadCategories()
            } catch (error) {
                toast.error('Gagal menghapus kategori')
                console.error(error)
            } finally {
                setShowDeleteModal(false)
                setCategoryToDelete(null)
            }
        })
    }

    const columns: ColumnDef<GalleryCategoryWithAuthor>[] = [
        {
            accessorKey: 'title',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Judul
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
            cell: ({ row }) => (
                <code className="text-sm bg-muted px-2 py-1 rounded">
                    {row.getValue('slug')}
                </code>
            ),
        },
        {
            accessorKey: 'order',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Urutan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={row.getValue('isActive') ? 'default' : 'secondary'}>
                    {row.getValue('isActive') ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
            ),
        },
        {
            accessorKey: '_count.items',
            header: 'Jumlah Item',
            cell: ({ row }) => (
                <span>{row.original._count.items} item</span>
            ),
        },
        {
            accessorKey: 'author.name',
            header: 'Dibuat Oleh',
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Tanggal Dibuat
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                format(new Date(row.getValue('createdAt')), 'dd MMM yyyy', { locale: id })
            ),
        },
    ]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowWrapper = (row: any, children: React.ReactNode) => (
        <ContextMenu key={row.id}>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => handleView(row.original)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleEdit(row.original.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={() => handleDelete(row.original.id)}
                    className="text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Kategori Galeri</h1>
                    <p className="text-muted-foreground">
                        Kelola kategori untuk galeri website
                    </p>
                </div>
                <Button onClick={() => router.push('/admin/gallery/gallery-categories/create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Kategori
                </Button>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <DataTable
                    columns={columns}
                    data={categories}
                    searchPlaceholder="Cari kategori..."
                    searchColumn="title"
                    rowWrapper={rowWrapper}
                />
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {categories.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Belum ada kategori galeri</p>
                    </div>
                ) : (
                    categories.map((category) => (
                        <GalleryCategoryMobileCard
                            key={category.id}
                            category={category}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            {/* Detail Modal */}
            <GalleryCategoryDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                category={selectedCategory}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmDialog
                open={showDeleteModal}
                onOpenChange={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Kategori"
                description="Semua item galeri yang terkait dengan kategori ini akan terpengaruh. Tindakan ini tidak dapat dibatalkan."
                loading={isPending}
            />
        </div>
    )
}