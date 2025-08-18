'use client'

import { useState, useMemo } from 'react'
import { FAQ } from '@prisma/client'
import { DataTable } from '@/components/molecules/data-table'
import { FAQForm } from '@/components/admin/faq/faq-form'
import { FAQDetailModal } from '@/components/admin/faq/faq-detail-modal'
import { FAQMobileCard } from '@/components/admin/faq/faq-mobile-card'
import { DeleteConfirmDialog } from '@/components/molecules/delete-confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/atoms/input'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Plus, Eye, Edit, Trash2, Search } from 'lucide-react'
import { deleteFAQ } from '@/lib/actions/faq-actions'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { faqColumns } from '@/components/admin/faq/faq-table-columns'
import { useIsMobile } from '@/hooks/use-mobile'

interface FAQManagementProps {
    initialData: FAQ[]
}

export function FAQManagement({ initialData }: FAQManagementProps) {
    const [faqs, setFAQs] = useState<FAQ[]>(initialData)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [showDetail, setShowDetail] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const isMobile = useIsMobile()

    const filteredFAQs = useMemo(() => {
        if (!searchQuery) return faqs

        return faqs.filter(faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [faqs, searchQuery])

    const handleView = (faq: FAQ) => {
        setSelectedFAQ(faq)
        setShowDetail(true)
    }

    const handleEdit = (faq: FAQ) => {
        setSelectedFAQ(faq)
        setShowForm(true)
    }

    const handleDelete = (faq: FAQ) => {
        setSelectedFAQ(faq)
        setShowDeleteDialog(true)
    }

    const confirmDelete = async () => {
        if (!selectedFAQ) return

        setDeleteLoading(true)
        try {
            const result = await deleteFAQ(selectedFAQ.id)

            if (result.success) {
                setFAQs(prev => prev.filter(faq => faq.id !== selectedFAQ.id))
                toast.success('FAQ berhasil dihapus')
                setShowDeleteDialog(false)
                setSelectedFAQ(null)
            } else {
                toast.error(result.error || 'Gagal menghapus FAQ')
            }
        } catch (error) {
            console.error('Delete error:', error)
            toast.error('Terjadi kesalahan saat menghapus FAQ')
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleFormSuccess = () => {
        // Refresh data setelah sukses create/update
        window.location.reload()
    }

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
                <ContextMenuItem onClick={() => handleEdit(row.original)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={() => handleDelete(row.original)}
                    className="text-red-600 focus:text-red-600"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardTitle>Daftar FAQ</CardTitle>
                        <Button onClick={() => setShowForm(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah FAQ
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Cari FAQ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {isMobile ? (
                        <div className="space-y-4">
                            {filteredFAQs.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    {searchQuery ? 'Tidak ada FAQ yang sesuai dengan pencarian' : 'Belum ada FAQ'}
                                </div>
                            ) : (
                                filteredFAQs.map((faq) => (
                                    <FAQMobileCard
                                        key={faq.id}
                                        faq={faq}
                                        onView={handleView}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))
                            )}
                        </div>
                    ) : (
                        <DataTable
                            columns={faqColumns}
                            data={filteredFAQs}
                            searchPlaceholder="Cari FAQ..."
                            searchColumn="question"
                            rowWrapper={rowWrapper}
                        />
                    )}
                </CardContent>
            </Card>

            <FAQForm
                open={showForm}
                onOpenChange={setShowForm}
                faq={selectedFAQ}
                onSuccess={handleFormSuccess}
            />

            <FAQDetailModal
                open={showDetail}
                onOpenChange={setShowDetail}
                faq={selectedFAQ}
            />

            <DeleteConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={confirmDelete}
                loading={deleteLoading}
                title="Hapus FAQ"
                description={`Apakah Anda yakin ingin menghapus FAQ "${selectedFAQ?.question}"? Tindakan ini tidak dapat dibatalkan.`}
            />
        </>
    )
}