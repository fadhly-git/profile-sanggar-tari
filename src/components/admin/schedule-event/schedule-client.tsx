'use client'

import { useState } from 'react'
import { Plus, Calendar, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { DataTable } from '@/components/molecules/data-table'
import { ScheduleForm } from '@/components/admin/schedule-event/schedule-form'
import { ScheduleDetailModal } from '@/components/admin/schedule-event/schedule-detail-modal'
import { ScheduleMobileCard } from '@/components/admin/schedule-event/schedule-mobile-card'
import { DeleteConfirmDialog } from '@/components/molecules/delete-confirm-dialog'
import { scheduleTableColumns } from '@/components/admin/schedule-event/schedule-table-columns'
import { deleteScheduleEvent } from '@/lib/actions/schedule-actions'
import { ScheduleEvent } from '@/types/schedule'
import { toast } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile'

interface SchedulePageProps {
    currentUserId: string
    data: ScheduleEvent[]
}

export function ScheduleClientPage({ currentUserId, data }: SchedulePageProps) {
    const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null)
    const [deletingEvent, setDeletingEvent] = useState<ScheduleEvent | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const isMobile = useIsMobile()


    const handleView = (event: ScheduleEvent) => {
        setSelectedEvent(event)
        setIsDetailOpen(true)
    }

    const handleEdit = (event: ScheduleEvent) => {
        setEditingEvent(event)
        setIsFormOpen(true)
    }

    const handleDelete = (event: ScheduleEvent) => {
        setDeletingEvent(event)
        setIsDeleteOpen(true)
    }

    const confirmDelete = async () => {
        if (!deletingEvent) return

        setIsDeleting(true)
        try {
            const result = await deleteScheduleEvent(deletingEvent.id)
            if (result.success) {
                toast.success(result.message)
                setIsDeleteOpen(false)
                setDeletingEvent(null)
            } else {
                toast.error(result.message)
            }
        } catch {
            toast.error('Gagal menghapus jadwal')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleFormSuccess = () => {
        setIsFormOpen(false)
        setEditingEvent(null)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setEditingEvent(null)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowWrapper = (row: any, children: React.ReactNode) => (
        <ContextMenu key={row.id}>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => handleView(row.original)}>
                    Lihat Detail
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleEdit(row.original)}>
                    Edit
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={() => handleDelete(row.original)}
                    className="text-red-600"
                >
                    Hapus
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
    console.log(isFormOpen)
    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Calendar className="h-6 w-6" />
                        Manajemen Jadwal Kegiatan
                    </h1>
                    <p className="text-muted-foreground">
                        Kelola jadwal dan kalender kegiatan organisasi
                    </p>
                </div>

                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Jadwal
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Jadwal</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jadwal Aktif</CardTitle>
                        <Filter className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.filter(event => event.isActive).length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jadwal Berulang</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.filter(event => event.isRecurring).length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bulan Ini</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.filter(event => {
                                const startDate = new Date(event.startDate)
                                const now = new Date()
                                return startDate.getMonth() === now.getMonth() &&
                                    startDate.getFullYear() === now.getFullYear()
                            }).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Data Display */}
            {data.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Belum Ada Jadwal</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            Mulai dengan menambahkan jadwal kegiatan pertama Anda
                        </p>
                        <Button
                            className="mt-4"
                            onClick={() => setIsFormOpen(true)}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Jadwal Pertama
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Desktop Table */}
                    {!isMobile && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Daftar Jadwal Kegiatan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    columns={scheduleTableColumns}
                                    data={data}
                                    searchPlaceholder="Cari jadwal kegiatan..."
                                    searchColumn="title"
                                    rowWrapper={rowWrapper}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Mobile Cards */}
                    {isMobile && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Daftar Jadwal Kegiatan</h2>
                            <div className="grid gap-4">
                                {data.map((event) => (
                                    <ScheduleMobileCard
                                        key={event.id}
                                        event={event}
                                        onView={() => handleView(event)}
                                        onEdit={() => handleEdit(event)}
                                        onDelete={() => handleDelete(event)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            <ScheduleDetailModal
                event={selectedEvent}
                open={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false)
                    setSelectedEvent(null)
                }}
            />

            <DeleteConfirmDialog
                open={isDeleteOpen}
                onOpenChange={() => {
                    setIsDeleteOpen(false)
                    setDeletingEvent(null)
                }}
                onConfirm={confirmDelete}
                title={deletingEvent?.title || ''}
                description="Tindakan ini tidak dapat dibatalkan dan akan menghapus jadwal secara permanen."
                loading={isDeleting}
            />

            <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
                <DialogContent className="!max-w-2xl max-h-[90vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingEvent ? 'Edit Jadwal Kegiatan' : 'Tambah Jadwal Kegiatan'}
                        </DialogTitle>
                    </DialogHeader>
                    <ScheduleForm
                        event={editingEvent ?? undefined}
                        onSuccess={handleFormSuccess}
                        authorId={currentUserId}
                    />
                    <DialogDescription className="mt-4">
                        Isi form di atas untuk menambahkan atau mengedit jadwal kegiatan.
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    )
}