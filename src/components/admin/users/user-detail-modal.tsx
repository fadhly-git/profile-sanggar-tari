'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BadgeStatus } from '@/components/atoms/badge-status'
import { User } from '@prisma/client'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface UserDetailModalProps {
    user: Pick<User, 'id' | 'email' | 'name' | 'role' | 'createdAt' | 'updatedAt'> | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UserDetailModal({ user, open, onOpenChange }: UserDetailModalProps) {
    if (!user) return null

    const getRoleBadgeStatus = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return 'danger'
            case 'ADMIN':
                return 'info'
            default:
                return 'info'
        }
    }

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return 'Super Admin'
            case 'ADMIN':
                return 'Admin'
            default:
                return role
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Detail Pengguna</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Nama</label>
                        <p className="text-sm mt-1">{user.name}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="text-sm mt-1">{user.email}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Role</label>
                        <div className="mt-1">
                            <BadgeStatus status={getRoleBadgeStatus(user.role)}>
                                {getRoleLabel(user.role)}
                            </BadgeStatus>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Dibuat pada</label>
                        <p className="text-sm mt-1">
                            {format(new Date(user.createdAt), 'dd MMMM yyyy, HH:mm', { locale: id })}
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Terakhir diperbarui</label>
                        <p className="text-sm mt-1">
                            {format(new Date(user.updatedAt), 'dd MMMM yyyy, HH:mm', { locale: id })}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}