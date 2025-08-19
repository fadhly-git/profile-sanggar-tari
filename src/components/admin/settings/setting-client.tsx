// @/app/admin/pengaturan-website/client.tsx (lanjutan)
"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Setting } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/molecules/data-table"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Eye, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"
import { columns } from "./website-settings-columns"
import { SettingCard } from "./setting-card"
import { SettingDetailDialog } from "./setting-detail-dialog"
import { SettingFormDialog } from "./setting-form-dialog"
import { DeleteConfirmDialog } from "@/components/molecules/delete-confirm-dialog"
import { deleteSetting, getAllSettings } from "@/lib/actions/setting-actions"

interface SettingsPageClientProps {
    initialData: Setting[]
}

export function SettingsPageClient({ initialData }: SettingsPageClientProps) {
    const [settings, setSettings] = useState<Setting[]>(initialData)
    const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null)
    const [detailOpen, setDetailOpen] = useState(false)
    const [formOpen, setFormOpen] = useState(false)
    const [editingSetting, setEditingSetting] = useState<Setting | null>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deletingSetting, setDeletingSetting] = useState<Setting | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const isMobile = useIsMobile()

    const refreshData = async () => {
        try {
            const result = await getAllSettings()
            if (result.success) {
                setSettings(result.data ?? [])
            }
        } catch (error) {
            console.error("Error refreshing data:", error)
        }
    }

    const handleView = (setting: Setting) => {
        setSelectedSetting(setting)
        setDetailOpen(true)
    }

    const handleEdit = (setting: Setting) => {
        setEditingSetting(setting)
        setFormOpen(true)
    }

    const handleDelete = (setting: Setting) => {
        setDeletingSetting(setting)
        setDeleteOpen(true)
    }

    const handleAdd = () => {
        setEditingSetting(null)
        setFormOpen(true)
    }

    const confirmDelete = async () => {
        if (!deletingSetting) return

        setIsDeleting(true)
        try {
            const result = await deleteSetting(deletingSetting.id)

            if (result.success) {
                toast.success("Pengaturan berhasil dihapus")
                await refreshData()
                setDeleteOpen(false)
                setDeletingSetting(null)
            } else {
                toast.error(result.error || "Gagal menghapus pengaturan")
            }
        } catch {
            toast.error("Terjadi kesalahan saat menghapus")
        } finally {
            setIsDeleting(false)
        }
    }

    const handleFormSuccess = async () => {
        await refreshData()
        setFormOpen(false)
        setEditingSetting(null)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowWrapper = (row: any, children: React.ReactNode) => {
        const setting = row.original
        return (
            <ContextMenu key={row.id}>
                <ContextMenuTrigger asChild>
                    {children}
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={() => handleView(setting)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleEdit(setting)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => handleDelete(setting)}
                        className="text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        )
    }

    if (isMobile) {
        return (
            <>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Pengaturan Website</h1>
                            <p className="text-muted-foreground">
                                Kelola pengaturan dan konfigurasi website
                            </p>
                        </div>
                        <Button onClick={handleAdd} className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Pengaturan
                        </Button>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid gap-4">
                        {settings.map((setting) => (
                            <SettingCard
                                key={setting.id}
                                setting={setting}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {settings.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Belum ada pengaturan</p>
                            <Button onClick={handleAdd} className="mt-4">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Pengaturan Pertama
                            </Button>
                        </div>
                    )}
                </div>

                {/* Dialogs */}
                <SettingDetailDialog
                    setting={selectedSetting}
                    open={detailOpen}
                    onOpenChange={setDetailOpen}
                />

                <SettingFormDialog
                    setting={editingSetting}
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    onSuccess={handleFormSuccess}
                />

                <DeleteConfirmDialog
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                    onConfirm={confirmDelete}
                    loading={isDeleting}
                    title="Hapus Pengaturan"
                    description="Apakah Anda yakin ingin menghapus pengaturan ini? Tindakan ini tidak dapat dibatalkan."
                />
            </>
        )
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Website</h1>
                        <p className="text-muted-foreground mt-2">
                            Kelola pengaturan dan konfigurasi website
                        </p>
                    </div>
                    <Button onClick={handleAdd}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Pengaturan
                    </Button>
                </div>

                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={settings}
                    searchColumn="key"
                    searchPlaceholder="Cari berdasarkan key..."
                    rowWrapper={rowWrapper}
                />

                {settings.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">Belum ada pengaturan</p>
                        <Button onClick={handleAdd}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Pengaturan Pertama
                        </Button>
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <SettingDetailDialog
                setting={selectedSetting}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />

            <SettingFormDialog
                setting={editingSetting}
                open={formOpen}
                onOpenChange={setFormOpen}
                onSuccess={handleFormSuccess}
            />

            <DeleteConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={confirmDelete}
                loading={isDeleting}
                title="Hapus Pengaturan"
                description={`Apakah Anda yakin ingin menghapus pengaturan "${deletingSetting?.key}"? Tindakan ini tidak dapat dibatalkan.`}
            />
        </>
    )
}