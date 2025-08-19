'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { BadgeStatus } from '@/components/atoms/badge-status'
import { MoreVertical, Eye, Edit, Trash } from 'lucide-react'
import { User } from '@prisma/client'
import { format } from 'date-fns'

interface UserCardProps {
    user: Pick<User, 'id' | 'email' | 'name' | 'role' | 'createdAt' | 'updatedAt'>
    onView: (user: Pick<User, 'id' | 'email' | 'name' | 'role' | 'createdAt' | 'updatedAt'>) => void
    onEdit: (user: Pick<User, 'id' | 'email' | 'name' | 'role' | 'createdAt' | 'updatedAt'>) => void
    onDelete: (user: Pick<User, 'id' | 'email' | 'name' | 'role' | 'createdAt' | 'updatedAt'>) => void
    currentUserRole?: string
    currentUserId?: string
}

export function UserCard({
    user,
    onView,
    onEdit,
    onDelete,
    currentUserRole,
    currentUserId
}: UserCardProps) {
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

    const canEdit = currentUserRole === 'SUPER_ADMIN' || currentUserId === user.id
    const canDelete = currentUserRole === 'SUPER_ADMIN' && currentUserId !== user.id

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h3 className="font-medium text-sm">{user.name}</h3>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView(user)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Lihat Detail
                            </DropdownMenuItem>
                            {canEdit && (
                                <DropdownMenuItem onClick={() => onEdit(user)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                            )}
                            {canDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete(user)}
                                    className="text-red-600"
                                >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Hapus
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Role</span>
                        <BadgeStatus status={getRoleBadgeStatus(user.role)}>
                            {getRoleLabel(user.role)}
                        </BadgeStatus>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Dibuat</span>
                        <span className="text-xs">
                            {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}