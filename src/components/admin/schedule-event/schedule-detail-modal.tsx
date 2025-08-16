'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { BadgeStatus } from '@/components/atoms/badge-status'
import { Calendar, MapPin, Repeat, User, Clock, FileText } from 'lucide-react'
import { ScheduleEvent } from '@/types/schedule'
import { formatDateTime } from '@/lib/utils'

interface ScheduleDetailModalProps {
    event: ScheduleEvent | null
    open: boolean
    onClose: () => void
}

export function ScheduleDetailModal({ event, open, onClose }: ScheduleDetailModalProps) {
    if (!event) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Detail Jadwal Kegiatan
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold">{event.title}</h2>
                        </div>
                        <BadgeStatus
                            status={event.isActive ? 'success' : 'danger'}
                        >
                            {event.isActive ? 'Aktif' : 'Nonaktif'}
                        </BadgeStatus>
                    </div>

                    {event.description && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 font-medium">
                                <FileText className="h-4 w-4" />
                                Deskripsi
                            </div>
                            <p className="text-muted-foreground leading-relaxed pl-6">
                                {event.description}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 font-medium">
                                <Calendar className="h-4 w-4" />
                                Tanggal Mulai
                            </div>
                            <p className="pl-6 text-muted-foreground">
                                {formatDateTime(event.startDate)}
                            </p>
                        </div>

                        {event.endDate && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-medium">
                                    <Clock className="h-4 w-4" />
                                    Tanggal Selesai
                                </div>
                                <p className="pl-6 text-muted-foreground">
                                    {formatDateTime(event.endDate)}
                                </p>
                            </div>
                        )}
                    </div>

                    {event.location && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 font-medium">
                                <MapPin className="h-4 w-4" />
                                Lokasi
                            </div>
                            <div
                                className="pl-6 w-full overflow-hidden rounded-md"
                                dangerouslySetInnerHTML={{ __html: event.location }}
                            />
                        </div>
                    )}

                    {event.isRecurring && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 font-medium">
                                <Repeat className="h-4 w-4" />
                                Pengulangan
                            </div>
                            <div className="pl-6">
                                <Badge variant="secondary">
                                    {event.recurringType === 'WEEKLY' && 'Mingguan'}
                                    {event.recurringType === 'MONTHLY' && 'Bulanan'}
                                    {event.recurringType === 'YEARLY' && 'Tahunan'}
                                </Badge>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2 pt-4 border-t">
                        <div className="flex items-center gap-2 font-medium">
                            <User className="h-4 w-4" />
                            Informasi Pembuat
                        </div>
                        <div className="pl-6 space-y-1">
                            <p className="text-muted-foreground">Nama: {event.author.name}</p>
                            <p className="text-muted-foreground">Email: {event.author.email}</p>
                            <p className="text-sm text-muted-foreground">
                                Dibuat: {formatDateTime(event.createdAt)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Diperbarui: {formatDateTime(event.updatedAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}