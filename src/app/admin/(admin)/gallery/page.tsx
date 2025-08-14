// @/app/admin/gallery/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/molecules/data-table'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile'
import { GalleryItem } from '@/types/gallery'
import { getGalleryItems, deleteGalleryItem } from '@/lib/actions/gallery-actions'
import { createGalleryColumns } from '@/components/admin/gallery/gallery-columns'
import { GalleryMobileCard } from '@/components/admin/gallery/gallery-mobile-card'
import { GalleryDetailModal } from '@/components/admin/gallery/gallery-detail-modal'
import { GalleryDeleteModal } from '@/components/admin/gallery/gallery-delete-modal'
import { GalleryContextMenu } from '@/components/admin/gallery/gallery-context-menu'

export default function GalleryPage() {
    const router = useRouter()
    const isMobile = useIsMobile()

    const [items, setItems] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Modals state
    const [detailModal, setDetailModal] = useState<{
        open: boolean
        item: GalleryItem | null
    }>({ open: false, item: null })

    const [deleteModal, setDeleteModal] = useState<{
        open: boolean
        item: GalleryItem | null
    }>({ open: false, item: null })

    const fetchItems = async () => {
        setLoading(true)
        const result = await getGalleryItems()

        if (result.success) {
            setItems(result.data ?? [])
        } else {
            toast.error(result.error)
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchItems()
    }, [])

    const handleView = (item: GalleryItem) => {
        setDetailModal({ open: true, item })
    }

    const handleEdit = (item: GalleryItem) => {
        router.push(`/admin/gallery/edit/${item.id}`)
    }

    const handleDelete = (item: GalleryItem) => {
        setDeleteModal({ open: true, item })
    }

    const handleConfirmDelete = async () => {
        if (!deleteModal.item) return

        setDeleteLoading(true)
        const result = await deleteGalleryItem(deleteModal.item.id)

        if (result.success) {
            toast.success('Item galeri berhasil dihapus')
            setItems(prev => prev.filter(item => item.id !== deleteModal.item!.id))
            setDeleteModal({ open: false, item: null })
        } else {
            toast.error(result.error)
        }

        setDeleteLoading(false)
    }

    const columns = createGalleryColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Galeri</h1>
                    <p className="text-muted-foreground">
                        Kelola item galeri dan media
                    </p>
                </div>

                <Button onClick={() => router.push('/admin/gallery/create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Item
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Item Galeri</CardTitle>
                </CardHeader>
                <CardContent>
                    {isMobile ? (
                        <div className="space-y-4">
                            {items.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">Belum ada item galeri</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <GalleryMobileCard
                                        key={item.id}
                                        item={item}
                                        onView={handleView}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))
                            )}
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={items}
                            searchPlaceholder="Cari berdasarkan judul..."
                            searchColumn="title"
                            rowWrapper={(row, children) => (
                                <GalleryContextMenu
                                    item={row.original}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                >
                                    {children}
                                </GalleryContextMenu>
                            )}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Modals */}
            <GalleryDetailModal
                item={detailModal.item}
                open={detailModal.open}
                onClose={() => setDetailModal({ open: false, item: null })}
            />

            <GalleryDeleteModal
                item={deleteModal.item}
                open={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, item: null })}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
            />
        </div>
    )
}