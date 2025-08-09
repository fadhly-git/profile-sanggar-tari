// components/ui/date-picker.tsx
"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    date?: Date
    onDateChange: (date: Date | undefined) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    label?: string
    error?: string
    helperText?: string
}

export function DatePicker({
    date,
    onDateChange,
    placeholder = "Pick a date",
    disabled,
    className,
    label,
    error,
    helperText
}: DatePickerProps) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {label}
                </label>
            )}
            <Popover>
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
                        {date ? format(date, "PPP") : <span>{placeholder}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={onDateChange}
                        initialFocus
                    />
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