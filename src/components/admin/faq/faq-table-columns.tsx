'use client'

import { ColumnDef } from '@tanstack/react-table'
import { FAQ } from '@prisma/client'
import { BadgeStatus } from '@/components/atoms/badge-status'
import { StatusBadge } from '@/components/atoms/badge-status'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export const faqColumns: ColumnDef<FAQ>[] = [
  {
    accessorKey: 'order',
    header: 'Urutan',
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue('order')}
        </div>
      )
    },
  },
  {
    accessorKey: 'question',
    header: 'Pertanyaan',
    cell: ({ row }) => {
      const question = row.getValue('question') as string
      return (
        <div className="max-w-md">
          <StatusBadge text={question} maxLength={100} />
        </div>
      )
    },
  },
  {
    accessorKey: 'answer',
    header: 'Jawaban',
    cell: ({ row }) => {
      const answer = row.getValue('answer') as string
      return (
        <div className="max-w-md">
          <StatusBadge text={answer} maxLength={150} />
        </div>
      )
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return (
        <BadgeStatus status={isActive ? 'success' : 'danger'}>
          {isActive ? 'Aktif' : 'Tidak Aktif'}
        </BadgeStatus>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Dibuat',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date
      return (
        <div className="text-sm text-muted-foreground">
          {format(new Date(date), 'dd MMM yyyy', { locale: id })}
        </div>
      )
    },
  },
]