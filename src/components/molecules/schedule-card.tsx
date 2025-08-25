// @/components/molecules/schedule-card.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Calendar, Clock, MapPin, Repeat } from 'lucide-react'
import { format, addWeeks, addMonths, addYears, isSameDay } from 'date-fns'
import { id } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { RecurringType } from '@prisma/client'

interface ScheduleCardProps {
    title: string
    description?: string
    startDate: Date
    endDate?: Date
    location?: string
    isRecurring?: boolean
    recurringType?: RecurringType
    showNextOccurrences?: number // Berapa banyak jadwal berikutnya yang ditampilkan
}

const getRecurringText = (startDate: Date, type: RecurringType) => {
    const dayOfWeek = format(startDate, 'EEEE', { locale: id })
    const dayOfMonth = format(startDate, 'd')
    const month = format(startDate, 'MMMM', { locale: id })

    switch (type) {
        case 'WEEKLY':
            return `Setiap ${dayOfWeek}`
        case 'MONTHLY':
            return `Setiap tanggal ${dayOfMonth}`
        case 'YEARLY':
            return `Setiap ${dayOfMonth} ${month}`
        default:
            return 'Berulang'
    }
}

export default function ScheduleCard({
    title,
    description,
    startDate,
    endDate,
    location,
    isRecurring = false,
    recurringType,
    showNextOccurrences = 3
}: ScheduleCardProps) {

    // Function untuk generate next occurrences jika recurring
    const getNextOccurrences = () => {
        if (!isRecurring || !recurringType) return []

        const occurrences = []
        let currentDate = new Date(startDate)

        for (let i = 0; i < showNextOccurrences; i++) {
            switch (recurringType) {
                case 'WEEKLY':
                    currentDate = addWeeks(currentDate, 1)
                    break
                case 'MONTHLY':
                    currentDate = addMonths(currentDate, 1)
                    break
                case 'YEARLY':
                    currentDate = addYears(currentDate, 1)
                    break
            }

            let nextEndDate = endDate ? new Date(endDate) : undefined
            if (nextEndDate) {
                switch (recurringType) {
                    case 'WEEKLY':
                        nextEndDate = addWeeks(nextEndDate, i + 1)
                        break
                    case 'MONTHLY':
                        nextEndDate = addMonths(nextEndDate, i + 1)
                        break
                    case 'YEARLY':
                        nextEndDate = addYears(nextEndDate, i + 1)
                        break
                }
            }

            occurrences.push({
                startDate: new Date(currentDate),
                endDate: nextEndDate
            })
        }

        return occurrences
    }

    // Function untuk extract dan render Google Maps iframe
    const renderLocation = () => {
        if (!location) return null

        // Check jika location adalah iframe Google Maps
        const iframeMatch = location.match(/<iframe[^>]*src="([^"]*)"[^>]*><\/iframe>/i)

        if (iframeMatch) {
            // Extract src URL dari iframe
            const srcUrl = iframeMatch[1]

            return (
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>Lokasi (Peta)</span>
                    </div>
                    <div className="rounded-md overflow-hidden">
                        <iframe
                            src={srcUrl}
                            width="100%"
                            height="200"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="rounded-md"
                        />
                    </div>
                </div>
            )
        } else {
            // Jika bukan iframe, tampilkan sebagai text biasa
            return (
                <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="break-words">{location}</span>
                </div>
            )
        }
    }

    const formatRecurringType = (type: string) => {
        switch (type) {
            case 'WEEKLY': return 'Mingguan'
            case 'MONTHLY': return 'Bulanan'
            case 'YEARLY': return 'Tahunan'
            default: return type
        }
    }

    const nextOccurrences = getNextOccurrences()

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{title}</h3>
                    {isRecurring && recurringType && (
                        <Badge variant="secondary" className="flex items-center space-x-1">
                            <Repeat className="h-3 w-3" />
                            <span className="text-xs">{formatRecurringType(recurringType)}</span>
                        </Badge>
                    )}
                </div>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Jadwal Utama */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                            {isRecurring ? (
                                recurringType ? getRecurringText(startDate, recurringType) : ''
                            ) : (
                                <>
                                    {format(startDate, 'dd MMMM yyyy', { locale: id })}
                                    {endDate && endDate.toDateString() !== startDate.toDateString() &&
                                        ` - ${format(endDate, 'dd MMMM yyyy', { locale: id })}`
                                    }
                                </>
                            )}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>
                            {format(startDate, 'HH:mm')}
                            {endDate && ` - ${format(endDate, 'HH:mm')}`}
                        </span>
                    </div>
                </div>

                {/* Jadwal Berikutnya jika Recurring */}
                {isRecurring && nextOccurrences.length > 0 && (
                    <div className="border-t pt-3">
                        <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                            Jadwal Berikutnya:
                        </h4>
                        <div className="space-y-1">
                            {nextOccurrences.map((occurrence, index) => (
                                <div key={index} className="text-xs text-muted-foreground pl-4">
                                    • {format(occurrence.startDate, 'dd MMM yyyy', { locale: id })} - {format(occurrence.startDate, 'HH:mm')}
                                    {occurrence.endDate && ` s/d ${format(occurrence.endDate, 'HH:mm')}`}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Location */}
                {renderLocation()}
            </CardContent>
        </Card>
    )
}