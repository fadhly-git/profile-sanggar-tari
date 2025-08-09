// components/atoms/select.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import {
    Select as ShadcnSelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface SelectProps {
    label?: string
    error?: string
    helperText?: string
    placeholder?: string
    options: { value: string | number, label: string }[]
    value?: string
    onValueChange?: (value: string) => void
    disabled?: boolean
    className?: string
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
    ({ className, label, error, helperText, options, placeholder = "Pilih...", ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                    </label>
                )}
                <ShadcnSelect {...props}>
                    <SelectTrigger
                        ref={ref}
                        className={cn(
                            error && "border-red-500 focus:ring-red-500",
                            className
                        )}
                    >
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </ShadcnSelect>
                {error && <p className="text-xs text-red-500">{error}</p>}
                {helperText && !error && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
                )}
            </div>
        )
    }
)

Select.displayName = 'Select'

export default Select