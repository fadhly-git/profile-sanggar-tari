// components/ui/datetime-picker.tsx
"use client"

import { format } from "date-fns"
import { id, enUS } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePicker } from "./date-picker"
import { TimePicker } from "./time-picker"
import { useState } from "react"

interface DateTimePickerProps {
    datetime?: Date
    onDateTimeChange: (datetime: Date | undefined) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    label?: string
    error?: string
    helperText?: string
    locale?: "id" | "en"
    format12h?: boolean
    minDate?: Date
    maxDate?: Date
}

export function DateTimePicker({
    datetime,
    onDateTimeChange,
    placeholder = "Select date and time",
    disabled,
    className,
    label,
    error,
    helperText,
    locale = "en",
    format12h = true,
    minDate,
    maxDate
}: DateTimePickerProps) {
    const [open, setOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(datetime)
    const [selectedTime, setSelectedTime] = useState<string | undefined>(
        datetime ? format(datetime, format12h ? "hh:mm a" : "HH:mm") : undefined
    )

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date)
        if (date && selectedTime) {
            updateDateTime(date, selectedTime)
        }
    }

    const handleTimeChange = (time: string | undefined) => {
        setSelectedTime(time)
        if (selectedDate && time) {
            updateDateTime(selectedDate, time)
        }
    }

    // Di datetime-picker.tsx, perbaiki fungsi updateDateTime:
    const updateDateTime = (date: Date, time: string) => {
        let hour: number, minute: number

        if (format12h && (time.includes("AM") || time.includes("PM"))) {
            const [timeStr, period] = time.split(" ")
            const [h, m] = timeStr.split(":").map(Number)
            minute = m

            // FIXED: Konversi jam 12-hour ke 24-hour
            if (period === "AM") {
                hour = h === 12 ? 0 : h  // 12 AM = 0, 1 AM = 1, dll
            } else {
                hour = h === 12 ? 12 : h + 12  // 12 PM = 12, 1 PM = 13, dll
            }
        } else {
            const [h, m] = time.split(":").map(Number)
            hour = h
            minute = m
        }

        const newDateTime = new Date(date)
        newDateTime.setHours(hour, minute, 0, 0)
        onDateTimeChange(newDateTime)
    }

    const handleNow = () => {
        const now = new Date()
        setSelectedDate(now)
        setSelectedTime(format(now, format12h ? "hh:mm a" : "HH:mm"))
        onDateTimeChange(now)
        setOpen(false)
    }

    const formatDateTime = (dt: Date) => {
        const dateFormat = locale === "id" ? "dd MMMM yyyy" : "MMM dd, yyyy"
        const timeFormat = format12h ? "hh:mm a" : "HH:mm"
        return `${format(dt, dateFormat, { locale: locale === "id" ? id : enUS })} ${format(dt, timeFormat)}`
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
                            "w-full justify-start text-left font-normal",
                            !datetime && "text-muted-foreground",
                            error && "border-red-500",
                            className
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {datetime ? formatDateTime(datetime) : <span>{placeholder}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Tabs defaultValue="date" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="date">
                                {locale === "id" ? "Tanggal" : "Date"}
                            </TabsTrigger>
                            <TabsTrigger value="time">
                                {locale === "id" ? "Waktu" : "Time"}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="date" className="p-3">
                            <DatePicker
                                date={selectedDate}
                                onDateChange={handleDateChange}
                                locale={locale}
                                minDate={minDate}
                                maxDate={maxDate}
                                className="border-0 p-0"
                            />
                        </TabsContent>

                        <TabsContent value="time" className="p-3">
                            <TimePicker
                                time={selectedTime}
                                onTimeChange={handleTimeChange}
                                locale={locale}
                                format12h={format12h}
                                className="border-0 p-0"
                            />
                        </TabsContent>
                    </Tabs>

                    {/* Now button */}
                    <div className="flex justify-between p-3 border-t">
                        <div className="flex space-x-2">
                            {selectedDate && selectedTime && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => setOpen(false)}
                                >
                                    {locale === "id" ? "Selesai" : "Done"}
                                </Button>
                            )}
                        </div>
                        <Button variant="outline" size="sm" onClick={handleNow}>
                            {locale === "id" ? "Sekarang" : "Now"}
                        </Button>
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