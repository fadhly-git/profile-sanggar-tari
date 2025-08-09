// components/ui/month-year-picker.tsx
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
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

interface MonthYearPickerProps {
    value?: string // Format: YYYY-MM
    onChange: (value: string) => void
    placeholder?: string
}

export function MonthYearPicker({ value, onChange, placeholder = "Pilih periode..." }: MonthYearPickerProps) {
    const [open, setOpen] = useState(false)

    // Convert value to Date object for display
    const selectedDate = value ? new Date(`${value}-01`) : undefined

    // Generate years (current year ± 5 years)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

    // Months
    const months = [
        { value: '01', label: 'Januari' },
        { value: '02', label: 'Februari' },
        { value: '03', label: 'Maret' },
        { value: '04', label: 'April' },
        { value: '05', label: 'Mei' },
        { value: '06', label: 'Juni' },
        { value: '07', label: 'Juli' },
        { value: '08', label: 'Agustus' },
        { value: '09', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ]

    const handleYearChange = (year: string) => {
        const currentMonth = value?.split('-')[1] || '01'
        onChange(`${year}-${currentMonth}`)
    }

    const handleMonthChange = (month: string) => {
        const selectedYear = value?.split('-')[0] || currentYear.toString()
        onChange(`${selectedYear}-${month}`)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                        format(selectedDate, "MMMM yyyy", { locale: id })
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tahun</label>
                        <Select value={value?.split('-')[0] || ''} onValueChange={handleYearChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Bulan</label>
                        <div className="grid grid-cols-3 gap-2">
                            {months.map((month) => (
                                <Button
                                    key={month.value}
                                    variant={value?.split('-')[1] === month.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleMonthChange(month.value)}
                                    className="h-8 text-xs"
                                >
                                    {month.label.slice(0, 3)}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}