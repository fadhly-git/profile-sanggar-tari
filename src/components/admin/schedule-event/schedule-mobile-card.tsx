// components/organisms/schedule-mobile-card.tsx
import { ScheduleEvent } from '@/types/schedule'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BadgeStatus } from '@/components/atoms/badge-status'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Repeat, User, Clock, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

interface ScheduleMobileCardProps {
    event: ScheduleEvent
    onView: () => void
    onEdit: () => void
    onDelete: () => void
}

export function ScheduleMobileCard({ event, onView, onEdit, onDelete }: ScheduleMobileCardProps) {
    return (
        <Card className="w-full hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base leading-tight truncate pr-2">
                            {event.title}
                        </h3>
                        {event.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {event.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <BadgeStatus
                            status={event.isActive ? 'success' : 'danger'}
                        >
                            {event.isActive ? 'Aktif' : 'Nonaktif'}
                        </BadgeStatus>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-muted"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Buka menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={onView} className="cursor-pointer">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Lihat Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={onDelete}
                                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">Mulai: {formatDateTime(event.startDate)}</span>
                    </div>

                    {event.endDate && (
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">Selesai: {formatDateTime(event.endDate)}</span>
                        </div>
                    )}

                    {event.location && (
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <BadgeStatus status="info">
                                Ada Lokasi
                            </BadgeStatus>
                        </div>
                    )}

                    {event.isRecurring && (
                        <div className="flex items-center gap-2 text-sm">
                            <Repeat className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <Badge variant="secondary">
                                {event.recurringType === 'WEEKLY' && 'Mingguan'}
                                {event.recurringType === 'MONTHLY' && 'Bulanan'}
                                {event.recurringType === 'YEARLY' && 'Tahunan'}
                            </Badge>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{event.author.name}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}