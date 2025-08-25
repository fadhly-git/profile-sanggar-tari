'use client'

import { useState, useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DataTable } from '@/components/molecules/data-table'
import { UserCard } from '@/components/admin/users/user-card'
import { UserForm } from '@/components/admin/users/user-form'
import { UserDetailModal } from '@/components/admin/users/user-detail-modal'
import { DeleteConfirmDialog } from '@/components/molecules/delete-confirm-dialog'
import { createUserColumns, UserRowWrapper } from '@/components/admin/users/user-columns'
import { getUsers, deleteUser } from '@/lib/actions/user-actions'
import { Plus, Users } from 'lucide-react'
import { toast } from 'sonner'
import { User } from '@prisma/client'

type UserData = Pick<User, 'id' | 'email' | 'name' | 'role' | 'createdAt' | 'updatedAt'>

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const isMobile = useIsMobile()

    // Simulasi current user - replace dengan actual auth
    const currentUser = {
        id: 'current-user-id',
        role: 'SUPER_ADMIN',
    }

    const loadUsers = async () => {
        try {
            setLoading(true)
            const result = await getUsers()
            if (result.success) {
                setUsers(result.data ?? [])
            } else {
                toast.error(result.error)
            }
        } catch {
            toast.error('Gagal memuat data pengguna')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()
    }, [])

    const handleView = (user: UserData) => {
        setSelectedUser(user)
        setDetailModalOpen(true)
    }

    const handleEdit = (user: UserData) => {
        setSelectedUser(user)
        setEditModalOpen(true)
    }

    const handleDelete = (user: UserData) => {
        setSelectedUser(user)
        setDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!selectedUser) return

        try {
            setDeleteLoading(true)
            const result = await deleteUser(selectedUser.id)

            if (result.success) {
                toast.success('Pengguna berhasil dihapus')
                setDeleteModalOpen(false)
                setSelectedUser(null)
                loadUsers()
            } else {
                toast.error(result.error)
            }
        } catch {
            toast.error('Gagal menghapus pengguna')
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleFormSuccess = () => {
        setCreateModalOpen(false)
        setEditModalOpen(false)
        setSelectedUser(null)
        loadUsers()
    }

    const columns = createUserColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        currentUserRole: currentUser.role,
        currentUserId: currentUser.id,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowWrapper = (row: any, children: React.ReactNode) => (
        <UserRowWrapper
            key={row.id}
            row={row}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentUserRole={currentUser.role}
            currentUserId={currentUser.id}
        >
            {children}
        </UserRowWrapper>
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Memuat data pengguna...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h1>
                    <p className="text-muted-foreground">
                        Kelola pengguna dan hak akses sistem
                    </p>
                </div>

                {currentUser.role === 'SUPER_ADMIN' && (
                    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Pengguna
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                            </DialogHeader>
                            <UserForm
                                onSuccess={handleFormSuccess}
                                onCancel={() => setCreateModalOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {users.length === 0 ? (
                <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Belum ada pengguna</h3>
                    <p className="text-muted-foreground mb-4">
                        Mulai dengan menambah pengguna pertama
                    </p>
                    {currentUser.role === 'SUPER_ADMIN' && (
                        <Button onClick={() => setCreateModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Pengguna
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    {isMobile ? (
                        <div className="grid gap-4">
                            {users.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    currentUserRole={currentUser.role}
                                    currentUserId={currentUser.id}
                                />
                            ))}
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={users}
                            searchPlaceholder="Cari pengguna..."
                            searchColumn="name"
                            rowWrapper={rowWrapper}
                        />
                    )}
                </>
            )}

            {/* Edit Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Pengguna</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <UserForm
                            user={selectedUser}
                            onSuccess={handleFormSuccess}
                            onCancel={() => {
                                setEditModalOpen(false)
                                setSelectedUser(null)
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Detail Modal */}
            <UserDetailModal
                user={selectedUser}
                open={detailModalOpen}
                onOpenChange={(open) => {
                    setDetailModalOpen(open)
                    if (!open) setSelectedUser(null)
                }}
            />

            {/* Delete Confirmation */}
            <DeleteConfirmDialog
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={confirmDelete}
                loading={deleteLoading}
                title="Hapus Pengguna"
                description={
                    selectedUser
                        ? `Apakah Anda yakin ingin menghapus pengguna "${selectedUser.name}"? Tindakan ini tidak dapat dibatalkan.`
                        : ''
                }
            />
        </div>
    )
}