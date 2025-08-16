// components/molecules/date-picker.tsx
"use client"

import { format } from "date-fns"
import { id, enUS } from "date-fns/locale"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
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

interface EnhancedDatePickerProps {
    date?: Date
    onDateChange: (date: Date | undefined) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    label?: string
    error?: string
    helperText?: string
    locale?: "id" | "en"
    minDate?: Date
    maxDate?: Date
}

const months = {
    id: [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ],
    en: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
}

const weekDays = {
    id: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
}

export function DatePicker({
    date,
    onDateChange,
    placeholder = "Pick a date",
    disabled,
    className,
    label,
    error,
    helperText,
    locale = "en",
    minDate,
    maxDate
}: EnhancedDatePickerProps) {
    const [viewDate, setViewDate] = useState(date || new Date())
    const [open, setOpen] = useState(false)

    const currentMonth = viewDate.getMonth()
    const currentYear = viewDate.getFullYear()

    const years = Array.from({ length: 101 }, (_, i) => 2000 + i)

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay()
    }

    const handleDateSelect = (day: number) => {
        const selectedDate = new Date(currentYear, currentMonth, day)
        onDateChange(selectedDate)
        setOpen(false)
    }

    const handleToday = () => {
        const today = new Date()
        onDateChange(today)
        setViewDate(today)
        setOpen(false)
    }

    const isDateDisabled = (day: number) => {
        const dateToCheck = new Date(currentYear, currentMonth, day)
        if (minDate && dateToCheck < minDate) return true
        if (maxDate && dateToCheck > maxDate) return true
        return false
    }

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth)
        const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
        const days = []

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8" />)
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = date && date.getDate() === day &&
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear
            const isToday = new Date().getDate() === day &&
                new Date().getMonth() === currentMonth &&
                new Date().getFullYear() === currentYear
            const disabled = isDateDisabled(day)

            days.push(
                <button
                    key={day}
                    onClick={() => !disabled && handleDateSelect(day)}
                    disabled={disabled}
                    className={cn(
                        "h-8 w-8 rounded-md text-sm font-medium transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        isSelected && "bg-primary text-primary-foreground hover:bg-primary",
                        isToday && !isSelected && "bg-accent text-accent-foreground",
                        disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
                    )}
                >
                    {day}
                </button>
            )
        }

        return days
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
                            !date && "text-muted-foreground",
                            error && "border-red-500",
                            className
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: locale === "id" ? id : enUS }) : <span>{placeholder}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 space-y-3">
                        {/* Header with month/year selectors */}
                        <div className="flex items-center justify-between space-x-2">
                            <Select
                                value={currentMonth.toString()}
                                onValueChange={(value) => setViewDate(new Date(currentYear, parseInt(value), 1))}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {months[locale].map((month, index) => (
                                        <SelectItem key={index} value={index.toString()}>
                                            {month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={currentYear.toString()}
                                onValueChange={(value) => setViewDate(new Date(parseInt(value), currentMonth, 1))}
                            >
                                <SelectTrigger className="w-26">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex space-x-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setViewDate(new Date(currentYear, currentMonth - 1, 1))}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setViewDate(new Date(currentYear, currentMonth + 1, 1))}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Weekday headers */}
                        <div className="grid grid-cols-7 gap-1">
                            {weekDays[locale].map((day) => (
                                <div key={day} className="h-8 w-8 text-xs font-medium text-muted-foreground flex items-center justify-center">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {renderCalendar()}
                        </div>

                        {/* Today button */}
                        <div className="flex justify-end pt-2 border-t">
                            <Button variant="outline" size="sm" onClick={handleToday}>
                                {locale === "id" ? "Hari Ini" : "Today"}
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