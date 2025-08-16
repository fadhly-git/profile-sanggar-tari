// components/ui/datetime-picker.tsx
"use client"

import { CalendarIcon, Clock } from "lucide-react"
import { format as formatDate } from "date-fns"
import { id as idLocale, enUS } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { TimePicker } from "@/components/molecules/time-picker"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

interface DateTimePickerProps {
    dateTime?: Date
    onDateTimeChange: (dateTime: Date | undefined) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    label?: string
    error?: string
    helperText?: string
    locale?: "id" | "en"
    format12h?: boolean
    timezone?: string
}

export function DateTimePicker({
    dateTime,
    onDateTimeChange,
    placeholder,
    disabled,
    className,
    label,
    error,
    helperText,
    locale = "en",
    format12h = true,
    timezone = "Asia/Jakarta"
}: DateTimePickerProps) {
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'date' | 'time'>('date')

    // Helper functions (sama seperti sebelumnya)
    const toLocalDate = (date: Date, tz: string): Date => {
        try {
            const dateStr = date.toLocaleString("sv-SE", { timeZone: tz })
            return new Date(dateStr)
        } catch {
            return date
        }
    }

    const createDateWithTimezone = (year: number, month: number, day: number, hour: number, minute: number, tz: string): Date => {
        try {
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`
            const tempDate = new Date(dateStr)
            const localOffset = tempDate.getTimezoneOffset() * 60000
            const targetOffset = getTimezoneOffset(tz) * 60000
            return new Date(tempDate.getTime() - localOffset + targetOffset)
        } catch {
            const date = new Date(year, month, day, hour, minute, 0, 0)
            return date
        }
    }

    const getTimezoneOffset = (tz: string): number => {
        try {
            const date = new Date()
            const utc = date.getTime() + (date.getTimezoneOffset() * 60000)
            const targetTime = new Date(utc + (0 * 3600000))
            const localTime = new Date(targetTime.toLocaleString("en-US", { timeZone: tz }))
            return (targetTime.getTime() - localTime.getTime()) / 60000
        } catch {
            return 0
        }
    }

    const currentDate = dateTime ? toLocalDate(dateTime, timezone) : undefined

    const formatDateTime = (date: Date) => {
        const localDate = toLocalDate(date, timezone)
        const dateStr = formatDate(localDate, "PPP", {
            locale: locale === "id" ? idLocale : enUS
        })

        const timeOptions: Intl.DateTimeFormatOptions = {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: format12h
        }

        const timeStr = date.toLocaleTimeString(
            locale === "id" ? "id-ID" : "en-US",
            timeOptions
        )

        return { dateStr, timeStr }
    }

    const handleDateSelect = (date: Date | undefined) => {
        if (!date) {
            onDateTimeChange(undefined)
            return
        }

        if (currentDate) {
            const existingTime = currentDate.toLocaleTimeString("en-GB", {
                timeZone: timezone,
                hour12: false
            })
            const [hour, minute] = existingTime.split(':').map(Number)

            const newDateTime = createDateWithTimezone(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                hour,
                minute,
                timezone
            )
            onDateTimeChange(newDateTime)
        } else {
            const now = new Date()
            const currentTime = now.toLocaleTimeString("en-GB", {
                timeZone: timezone,
                hour12: false
            })
            const [hour, minute] = currentTime.split(':').map(Number)

            const newDateTime = createDateWithTimezone(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                hour,
                minute,
                timezone
            )
            onDateTimeChange(newDateTime)
        }

        // Auto switch to time tab after selecting date
        setActiveTab('time')
    }

    const handleTimeChange = (time: string | undefined) => {
        if (!time || !currentDate) return

        let hour: number, minute: number

        if (format12h && (time.includes("AM") || time.includes("PM"))) {
            const [timeStr, period] = time.split(" ")
            const [h, m] = timeStr.split(":").map(Number)
            minute = m

            if (period === "AM") {
                hour = h === 12 ? 0 : h
            } else {
                hour = h === 12 ? 12 : h + 12
            }
        } else {
            const [h, m] = time.split(":").map(Number)
            hour = h
            minute = m
        }

        const newDateTime = createDateWithTimezone(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            hour,
            minute,
            timezone
        )

        onDateTimeChange(newDateTime)
    }

    const getCurrentTime = (): string => {
        if (!currentDate) return ""

        const timeOptions: Intl.DateTimeFormatOptions = {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: format12h
        }

        return dateTime?.toLocaleTimeString(
            locale === "id" ? "id-ID" : "en-US",
            timeOptions
        ) || ""
    }

    const handleClose = () => {
        setOpen(false)
        setActiveTab('date') // Reset to date tab when closing
    }

    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {label}
                </label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            "w-full justify-start text-left font-normal h-auto py-3",
                            !dateTime && "text-muted-foreground",
                            error && "border-red-500",
                            className
                        )}
                    >
                        <CalendarIcon className="mr-3 h-4 w-4 flex-shrink-0" />
                        <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
                            {dateTime ? (
                                <>
                                    <span className="text-sm font-medium truncate w-full">
                                        {formatDateTime(dateTime).dateStr}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDateTime(dateTime).timeStr}
                                    </span>
                                </>
                            ) : (
                                <span className="text-sm">
                                    {placeholder || (locale === "id" ? "Pilih tanggal dan waktu" : "Pick date and time")}
                                </span>
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                    {/* Tab Navigation */}
                    <div className="flex border-b">
                        <Button
                            variant={activeTab === 'date' ? 'default' : 'ghost'}
                            size="sm"
                            className="flex-1 rounded-none rounded-tl-md"
                            onClick={() => setActiveTab('date')}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {locale === "id" ? "Tanggal" : "Date"}
                        </Button>
                        <Button
                            variant={activeTab === 'time' ? 'default' : 'ghost'}
                            size="sm"
                            className="flex-1 rounded-none rounded-tr-md"
                            onClick={() => setActiveTab('time')}
                            disabled={!currentDate}
                        >
                            <Clock className="mr-2 h-4 w-4" />
                            {locale === "id" ? "Waktu" : "Time"}
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="p-0">
                        {activeTab === 'date' && (
                            <Calendar
                                mode="single"
                                selected={currentDate}
                                onSelect={handleDateSelect}
                                initialFocus
                                locale={locale === "id" ? idLocale : enUS}
                                className="border-0"
                            />
                        )}

                        {activeTab === 'time' && currentDate && (
                            <div className="p-4 min-w-[280px]">
                                <div className="mb-4">
                                    <p className="text-sm font-medium mb-2">
                                        {locale === "id" ? "Pilih Waktu" : "Select Time"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDateTime(dateTime!).dateStr}
                                    </p>
                                </div>

                                <TimePicker
                                    time={getCurrentTime()}
                                    onTimeChange={handleTimeChange}
                                    format12h={format12h}
                                    locale={locale}
                                    placeholder={locale === "id" ? "Pilih waktu" : "Select time"}
                                />
                            </div>
                        )}
                    </div>

                    {/* Footer with timezone info and actions */}
                    <div className="border-t bg-muted/30 px-4 py-3">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                                {locale === "id" ? "Zona waktu" : "Timezone"}: {timezone}
                            </p>
                            <div className="flex gap-2">
                                {dateTime && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            onDateTimeChange(undefined)
                                            handleClose()
                                        }}
                                        className="text-xs h-7"
                                    >
                                        {locale === "id" ? "Hapus" : "Clear"}
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    onClick={handleClose}
                                    className="text-xs h-7"
                                >
                                    {locale === "id" ? "Selesai" : "Done"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
        </div>
    )
}