'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { BadgeStatus } from '@/components/atoms/badge-status'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Eye, Edit, Trash, MoreHorizontal } from 'lucide-react'
import { User } from '@prisma/client'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

type UserData = Pick<User, 'id' | 'email' | 'name' | 'role' | 'createdAt' | 'updatedAt'>

interface UserColumnsProps {
    onView: (user: UserData) => void
    onEdit: (user: UserData) => void
    onDelete: (user: UserData) => void
    currentUserRole?: string
    currentUserId?: string
}

export function createUserColumns({
    onView,
    onEdit,
    onDelete,
    currentUserRole,
    currentUserId,
}: UserColumnsProps): ColumnDef<UserData>[] {
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

    return [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 px-2 lg:px-3"
                >
                    Nama
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('name')}</div>
            ),
        },
        {
            accessorKey: 'email',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 px-2 lg:px-3"
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => {
                const role = row.getValue('role') as string
                return (
                    <BadgeStatus status={getRoleBadgeStatus(role)}>
                        {getRoleLabel(role)}
                    </BadgeStatus>
                )
            },
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-8 px-2 lg:px-3"
                >
                    Dibuat
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const date = row.getValue('createdAt') as Date
                return format(new Date(date), 'dd/MM/yyyy')
            },
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                const user = row.original as UserData
                const canEdit = currentUserRole === 'SUPER_ADMIN' || currentUserId === user.id
                const canDelete = currentUserRole === 'SUPER_ADMIN' && currentUserId !== user.id

                return (
                    <DropdownMenu key={user.id}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 px-2 lg:px-3">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
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
                )
            },
        },
    ]
}

interface UserRowWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any
  children: React.ReactNode
  onView: (user: UserData) => void
  onEdit: (user: UserData) => void
  onDelete: (user: UserData) => void
  currentUserRole?: string
  currentUserId?: string
}

export function UserRowWrapper({
  row,
  children,
  onView,
  onEdit,
  onDelete,
  currentUserRole,
  currentUserId,
}: UserRowWrapperProps) {
  const user = row.original as UserData
  const canEdit = currentUserRole === 'SUPER_ADMIN' || currentUserId === user.id
  const canDelete = currentUserRole === 'SUPER_ADMIN' && currentUserId !== user.id

  return (
    <ContextMenu key={row.id}>
      <ContextMenuTrigger asChild key={row.id}>
          {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => onView(user)}>
          <Eye className="h-4 w-4 mr-2" />
          Lihat Detail
        </ContextMenuItem>
        {canEdit && (
          <ContextMenuItem onClick={() => onEdit(user)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </ContextMenuItem>
        )}
        {canDelete && (
          <ContextMenuItem 
            onClick={() => onDelete(user)}
            className="text-red-600"
          >
            <Trash className="h-4 w-4 mr-2" />
            Hapus
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}