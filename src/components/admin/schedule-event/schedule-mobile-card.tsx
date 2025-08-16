import { ScheduleEvent } from '@/types/schedule'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BadgeStatus } from '@/components/atoms/badge-status'
import { Calendar, MapPin, Repeat, User, Clock } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'

interface ScheduleMobileCardProps {
    event: ScheduleEvent
    onView: () => void
    onEdit: () => void
    onDelete: () => void
}

export function ScheduleMobileCard({ event, onView, onEdit, onDelete }: ScheduleMobileCardProps) {
    return (
        <ContextMenu key={event.id}>
            <ContextMenuTrigger>
                <Card className="w-full hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="font-semibold text-base leading-tight">{event.title}</h3>
                                {event.description && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {event.description}
                                    </p>
                                )}
                            </div>
                            <BadgeStatus
                                status={event.isActive ? 'success' : 'danger'}
                            >
                                {event.isActive ? 'Aktif' : 'Nonaktif'}
                            </BadgeStatus>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Mulai: {formatDateTime(event.startDate)}</span>
                            </div>

                            {event.endDate && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>Selesai: {formatDateTime(event.endDate)}</span>
                                </div>
                            )}

                            {event.location && (
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <BadgeStatus status="info" >
                                        Ada Lokasi
                                    </BadgeStatus>
                                </div>
                            )}

                            {event.isRecurring && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Repeat className="h-4 w-4 text-muted-foreground" />
                                    <Badge variant="secondary">
                                        {event.recurringType === 'WEEKLY' && 'Mingguan'}
                                        {event.recurringType === 'MONTHLY' && 'Bulanan'}
                                        {event.recurringType === 'YEARLY' && 'Tahunan'}
                                    </Badge>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{event.author.name}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ContextMenuTrigger>

            <ContextMenuContent>
                <ContextMenuItem onClick={onView}>
                    Lihat Detail
                </ContextMenuItem>
                <ContextMenuItem onClick={onEdit}>
                    Edit
                </ContextMenuItem>
                <ContextMenuItem onClick={onDelete} className="text-red-600">
                    Hapus
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}