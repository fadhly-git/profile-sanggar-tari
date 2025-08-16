// components/ui/time-picker.tsx
"use client"

import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

interface TimePickerProps {
    time?: string
    onTimeChange: (time: string | undefined) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    label?: string
    error?: string
    helperText?: string
    locale?: "id" | "en"
    format12h?: boolean
}

const timePresets = [
    "09:00", "12:00", "15:00", "18:00", "21:00"
]

export function TimePicker({
    time,
    onTimeChange,
    placeholder = "Select time",
    disabled,
    className,
    label,
    error,
    helperText,
    locale = "en",
    format12h = true
}: TimePickerProps) {
    const [open, setOpen] = useState(false)

    // Parse current time
    const parseTime = (timeStr?: string) => {
        if (!timeStr) return { hour: 12, minute: 0, period: "AM" }

        if (format12h && (timeStr.includes("AM") || timeStr.includes("PM"))) {
            const [time, period] = timeStr.split(" ")
            const [hour, minute] = time.split(":").map(Number)
            return { hour, minute, period }
        } else {
            const [hour, minute] = timeStr.split(":").map(Number)
            if (format12h) {
                const period = hour >= 12 ? "PM" : "AM"
                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
                return { hour: displayHour, minute, period }
            }
            return { hour, minute, period: "AM" }
        }
    }

    const formatTime = (hour: number, minute: number, period?: string) => {
        if (format12h && period) {
            return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`
        }
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    }

    const { hour, minute, period } = parseTime(time)

    const handleTimeChange = (newHour: number, newMinute: number, newPeriod?: string) => {
        const formattedTime = formatTime(newHour, newMinute, newPeriod)
        onTimeChange(formattedTime)
    }

    const handlePresetTime = (preset: string) => {
        if (format12h) {
            const [h, m] = preset.split(":").map(Number)
            const period = h >= 12 ? "PM" : "AM"
            const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h
            handleTimeChange(displayHour, m, period)
        } else {
            onTimeChange(preset)
        }
        setOpen(false)
    }

    const handleNow = () => {
        const now = new Date()
        const currentHour = now.getHours()
        const currentMinute = now.getMinutes()

        if (format12h) {
            const period = currentHour >= 12 ? "PM" : "AM"
            const displayHour = currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour
            handleTimeChange(displayHour, currentMinute, period)
        } else {
            handleTimeChange(currentHour, currentMinute)
        }
        setOpen(false)
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
                            !time && "text-muted-foreground",
                            error && "border-red-500",
                            className
                        )}
                    >
                        <Clock className="mr-2 h-4 w-4" />
                        {time || <span>{placeholder}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 space-y-3">
                        {/* Time selectors */}
                        <div className="flex items-center space-x-2">
                            {/* Hour Selector - FIXED */}
                            <Select
                                value={hour.toString()}
                                onValueChange={(value) => handleTimeChange(parseInt(value), minute, period)}
                            >
                                <SelectTrigger className="w-16">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {format12h ? (
                                        // Untuk 12-hour format: 1, 2, 3, ..., 12
                                        Array.from({ length: 12 }, (_, i) => {
                                            const hourValue = i + 1; // 1-12
                                            return (
                                                <SelectItem key={hourValue} value={hourValue.toString()}>
                                                    {hourValue.toString().padStart(2, '0')}
                                                </SelectItem>
                                            )
                                        })
                                    ) : (
                                        // Untuk 24-hour format: 0, 1, 2, ..., 23
                                        Array.from({ length: 24 }, (_, i) => (
                                            <SelectItem key={i} value={i.toString()}>
                                                {i.toString().padStart(2, '0')}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>

                            <span className="text-lg font-medium">:</span>

                            <Select
                                value={minute.toString()}
                                onValueChange={(value) => handleTimeChange(hour, parseInt(value), period)}
                            >
                                <SelectTrigger className="w-16">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 60 }, (_, i) => (
                                        <SelectItem key={i} value={i.toString()}>
                                            {i.toString().padStart(2, '0')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {format12h && (
                                <Select
                                    value={period}
                                    onValueChange={(value) => handleTimeChange(hour, minute, value)}
                                >
                                    <SelectTrigger className="w-16">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AM">AM</SelectItem>
                                        <SelectItem value="PM">PM</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        {/* Preset times */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">
                                {locale === "id" ? "Waktu Preset" : "Preset Times"}
                            </p>
                            <div className="grid grid-cols-3 gap-1">
                                {timePresets.map((preset) => (
                                    <Button
                                        key={preset}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePresetTime(preset)}
                                        className="text-xs"
                                    >
                                        {format12h ? (() => {
                                            const [h, m] = preset.split(":").map(Number)
                                            const period = h >= 12 ? "PM" : "AM"
                                            const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h
                                            return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`
                                        })() : preset}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Now button */}
                        <div className="flex justify-end pt-2 border-t">
                            <Button variant="outline" size="sm" onClick={handleNow}>
                                {locale === "id" ? "Sekarang" : "Now"}
                            </Button>
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