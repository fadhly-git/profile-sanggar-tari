'use client'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { BadgeStatus } from '@/components/atoms/badge-status'
import { formatDateTime } from '@/lib/utils'
import { ScheduleEvent } from '@/types/schedule'
import { MapPin, Calendar, Repeat, User } from 'lucide-react'

export const scheduleTableColumns: ColumnDef<ScheduleEvent>[] = [
    {
    accessorKey: 'title',
    header: 'Judul Kegiatan',
    cell: ({ row }) => (
      <div className="min-w-[200px]">
        <div className="font-medium">{row.original.title}</div>
        {row.original.description && (
          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
            {row.original.description}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'startDate',
    header: 'Tanggal Mulai',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 min-w-[150px]">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">
          {formatDateTime(row.original.startDate)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'endDate',
    header: 'Tanggal Selesai',
    cell: ({ row }) => (
      <div className="min-w-[150px]">
        {row.original.endDate ? (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {formatDateTime(row.original.endDate)}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'location',
    header: 'Lokasi',
    cell: ({ row }) => (
      <div className="min-w-[100px]">
        {row.original.location ? (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <BadgeStatus status="info">Ada Lokasi</BadgeStatus>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'isRecurring',
    header: 'Pengulangan',
    cell: ({ row }) => (
      <div className="min-w-[120px]">
        {row.original.isRecurring ? (
          <div className="flex items-center gap-2">
            <Repeat className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary">
              {row.original.recurringType === 'WEEKLY' && 'Mingguan'}
              {row.original.recurringType === 'MONTHLY' && 'Bulanan'}
              {row.original.recurringType === 'YEARLY' && 'Tahunan'}
            </Badge>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Tidak Berulang</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <BadgeStatus 
        status={row.original.isActive ? 'success' : 'danger'}
      >
        {row.original.isActive ? 'Aktif' : 'Nonaktif'}
      </BadgeStatus>
    ),
  },
  {
    accessorKey: 'author',
    header: 'Dibuat Oleh',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 min-w-[150px]">
        <User className="h-4 w-4 text-muted-foreground" />
        <div>
          <div className="font-medium text-sm">{row.original.author.name}</div>
          <div className="text-xs text-muted-foreground">{row.original.author.email}</div>
        </div>
      </div>
    ),
  },
]