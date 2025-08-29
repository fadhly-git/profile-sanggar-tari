// @/components/molecules/schedule-card-improved.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Calendar, Clock, MapPin, Repeat, AlertTriangle } from 'lucide-react'
import { format, addWeeks, addMonths, addYears, isAfter, isBefore, startOfDay, getDay, setDay } from 'date-fns'
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
    recurringEndDate?: Date
    showNextOccurrences?: number
    exceptions?: Date[]
}

const getRecurringText = (startDate: Date, type: RecurringType, endDate?: Date) => {
    const dayOfWeek = format(startDate, 'EEEE', { locale: id })
    const dayOfMonth = format(startDate, 'd')
    const month = format(startDate, 'MMMM', { locale: id })
    const startTime = format(startDate, 'HH:mm')
    const endTime = endDate ? ` - ${format(endDate, 'HH:mm')}` : ''

    switch (type) {
        case 'WEEKLY':
            return `Setiap ${dayOfWeek} pukul ${startTime}${endTime}`
        case 'MONTHLY':
            return `Setiap tanggal ${dayOfMonth} pukul ${startTime}${endTime}`
        case 'YEARLY':
            return `Setiap ${dayOfMonth} ${month} pukul ${startTime}${endTime}`
        default:
            return `Berulang pukul ${startTime}${endTime}`
    }
}

export default function ScheduleCardImproved({
    title,
    description,
    startDate,
    endDate,
    location,
    isRecurring = false,
    recurringType,
    recurringEndDate,
    showNextOccurrences = 5,
    exceptions = []
}: ScheduleCardProps) {

    // Helper function untuk mencari next valid date berdasarkan recurring type
    const getNextValidDate = (baseDate: Date, type: RecurringType) => {
        const now = new Date()
        const today = startOfDay(now)
        let nextDate = new Date(baseDate)

        // Jika bukan recurring, return as is
        if (!isRecurring) return baseDate

        // Untuk recurring, cari next occurrence dari hari ini
        switch (type) {
            case 'WEEKLY':
                // Cari hari yang sama di minggu ini atau selanjutnya
                const targetDayOfWeek = getDay(baseDate)
                const currentDayOfWeek = getDay(today)
                
                if (targetDayOfWeek >= currentDayOfWeek) {
                    // Masih ada di minggu ini
                    nextDate = setDay(today, targetDayOfWeek)
                } else {
                    // Minggu depan
                    nextDate = setDay(addWeeks(today, 1), targetDayOfWeek)
                }
                
                // Set time sesuai dengan original
                nextDate.setHours(baseDate.getHours(), baseDate.getMinutes(), 0, 0)
                break

            case 'MONTHLY':
                // Set tanggal yang sama di bulan ini atau selanjutnya
                nextDate = new Date(today.getFullYear(), today.getMonth(), baseDate.getDate())
                nextDate.setHours(baseDate.getHours(), baseDate.getMinutes(), 0, 0)
                
                if (isBefore(nextDate, today)) {
                    nextDate = addMonths(nextDate, 1)
                }
                break

            case 'YEARLY':
                // Set tanggal yang sama di tahun ini atau selanjutnya
                nextDate = new Date(today.getFullYear(), baseDate.getMonth(), baseDate.getDate())
                nextDate.setHours(baseDate.getHours(), baseDate.getMinutes(), 0, 0)
                
                if (isBefore(nextDate, today)) {
                    nextDate = addYears(nextDate, 1)
                }
                break
        }

        return nextDate
    }

    // Function untuk generate upcoming occurrences
    const getUpcomingOccurrences = () => {
        if (!isRecurring || !recurringType) return []

        const occurrences = []
        const nextOccurrence = getNextValidDate(startDate, recurringType)
        
        let currentDate = new Date(nextOccurrence)

        for (let i = 0; i < showNextOccurrences; i++) {
            // Check apakah masih dalam batas recurring end date
            if (recurringEndDate && isAfter(currentDate, recurringEndDate)) {
                break
            }

            // Check apakah tanggal ini dikecualikan (libur)
            const isException = exceptions.some(exception => 
                startOfDay(exception).getTime() === startOfDay(currentDate).getTime()
            )

            let nextEndDate = endDate ? new Date(endDate) : undefined
            if (nextEndDate && endDate) {
                const duration = endDate.getTime() - startDate.getTime()
                nextEndDate = new Date(currentDate.getTime() + duration)
            }

            occurrences.push({
                startDate: new Date(currentDate),
                endDate: nextEndDate,
                isException
            })

            // Generate next occurrence
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
        }

        return occurrences
    }

    // Check apakah jadwal single sudah lewat
    const isSingleSchedulePast = () => {
        if (isRecurring) return false
        const now = new Date()
        const scheduleDate = endDate || startDate
        return isBefore(scheduleDate, now)
    }

    // Jika jadwal single sudah lewat, jangan tampilkan
    if (isSingleSchedulePast()) {
        return null
    }

    const upcomingOccurrences = getUpcomingOccurrences()

    // Jika recurring tapi tidak ada occurrence berikutnya, jangan tampilkan
    if (isRecurring && upcomingOccurrences.length === 0) {
        return null
    }

    // Function untuk extract dan render Google Maps iframe
    const renderLocation = () => {
        if (!location) return null

        const iframeMatch = location.match(/<iframe[^>]*src="([^"]*)"[^>]*><\/iframe>/i)

        if (iframeMatch) {
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

    return (
        <Card className="relative">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{title}</h3>
                    <div className="flex gap-2">
                        {isRecurring && recurringType && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                                <Repeat className="h-3 w-3" />
                                <span className="text-xs">{formatRecurringType(recurringType)}</span>
                            </Badge>
                        )}
                        {recurringEndDate && (
                            <Badge variant="outline" className="text-xs">
                                Sampai {format(recurringEndDate, 'dd MMM yyyy', { locale: id })}
                            </Badge>
                        )}
                    </div>
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
                        <span className="font-medium">
                            {isRecurring && recurringType ? (
                                getRecurringText(startDate, recurringType, endDate)
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
                    
                    {/* Show specific time for non-recurring */}
                    {!isRecurring && (
                        <div className="flex items-center space-x-2 text-sm">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>
                                {format(startDate, 'HH:mm')}
                                {endDate && ` - ${format(endDate, 'HH:mm')}`}
                            </span>
                        </div>
                    )}
                </div>

                {/* Jadwal Mendatang untuk Recurring */}
                {isRecurring && upcomingOccurrences.length > 0 && (
                    <div className="border-t pt-3">
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                            Jadwal Mendatang:
                        </h4>
                        <div className="space-y-2">
                            {upcomingOccurrences.map((occurrence, index) => (
                                <div 
                                    key={index} 
                                    className={`flex items-center justify-between text-xs p-2 rounded-md ${
                                        occurrence.isException 
                                            ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800' 
                                            : 'bg-muted/50'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <span className={occurrence.isException ? 'text-orange-600 dark:text-orange-400' : ''}>
                                            {format(occurrence.startDate, 'dd MMM yyyy, EEEE', { locale: id })}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {format(occurrence.startDate, 'HH:mm')}
                                            {occurrence.endDate && ` - ${format(occurrence.endDate, 'HH:mm')}`}
                                        </span>
                                    </div>
                                    {occurrence.isException && (
                                        <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400">
                                            <AlertTriangle className="h-3 w-3" />
                                            <span className="text-xs">Libur</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {recurringEndDate && (
                            <div className="mt-3 text-xs text-muted-foreground">
                                <em>Recurring berakhir pada {format(recurringEndDate, 'dd MMMM yyyy', { locale: id })}</em>
                            </div>
                        )}
                    </div>
                )}

                {/* Location */}
                {renderLocation()}
            </CardContent>
        </Card>
    )
}

// Alias untuk kompatibilitas
export { ScheduleCardImproved as ScheduleCard }
