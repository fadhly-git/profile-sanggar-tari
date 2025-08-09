// components/ui/period-select.tsx
"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface PeriodSelectProps {
    value?: string // Format: YYYY-MM
    onChange: (value: string) => void
    placeholder?: string
}

export function PeriodSelect({ value, onChange }: PeriodSelectProps) {
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

    const selectedYear = value?.split('-')[0] || ''
    const selectedMonth = value?.split('-')[1] || ''

    const handleYearChange = (year: string) => {
        const month = selectedMonth || '01'
        onChange(`${year}-${month}`)
    }

    const handleMonthChange = (month: string) => {
        const year = selectedYear || currentYear.toString()
        onChange(`${year}-${month}`)
    }

    return (
        <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Tahun</label>
                <Select value={selectedYear} onValueChange={handleYearChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Tahun" />
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

            <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Bulan</label>
                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Bulan" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                                {month.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}