// components/atoms/multi-select.tsx
"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface Option {
    id: string
    label: string
    description?: string
}

interface MultiSelectProps {
    options: Option[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    className?: string
    disabled?: boolean
    label?: string
    error?: string
    helperText?: string
    maxHeight?: string
}

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = "Pilih opsi...",
    searchPlaceholder = "Cari opsi...",
    emptyMessage = "Opsi tidak ditemukan.",
    className,
    disabled,
    label,
    error,
    helperText,
    maxHeight = "max-h-64"
}: MultiSelectProps) {
    const [open, setOpen] = useState(false)

    const selectedOptions = options.filter(option =>
        value.includes(option.id)
    )

    const handleSelect = (optionId: string) => {
        if (value.includes(optionId)) {
            onChange(value.filter(id => id !== optionId))
        } else {
            onChange([...value, optionId])
        }
    }

    const handleRemove = (optionId: string) => {
        onChange(value.filter(id => id !== optionId))
    }

    const handleClearAll = () => {
        onChange([])
    }

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                </label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between",
                            error && "border-destructive"
                        )}
                        disabled={disabled}
                    >
                        <span className="truncate">
                            {value.length > 0
                                ? `${value.length} opsi dipilih`
                                : placeholder
                            }
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup className={cn(maxHeight, "overflow-auto")}>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    value={option.label}
                                    onSelect={() => handleSelect(option.id)}
                                    className="flex items-start gap-2"
                                >
                                    <Check
                                        className={cn(
                                            "mt-1 h-4 w-4 shrink-0",
                                            value.includes(option.id)
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium">{option.label}</div>
                                        {option.description && (
                                            <div className="text-sm text-muted-foreground line-clamp-2">
                                                {option.description}
                                            </div>
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        {value.length > 0 && (
                            <div className="border-t p-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-muted-foreground hover:text-foreground"
                                    onClick={handleClearAll}
                                >
                                    Hapus Semua Pilihan
                                </Button>
                            </div>
                        )}
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Selected Items */}
            {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedOptions.map((option) => (
                        <Badge
                            key={option.id}
                            variant="secondary"
                            className="flex items-center gap-1 max-w-full"
                        >
                            <span className="truncate">{option.label}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent shrink-0"
                                onClick={() => handleRemove(option.id)}
                                disabled={disabled}
                                type="button"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            )}

            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}

            {helperText && !error && (
                <p className="text-sm text-muted-foreground">{helperText}</p>
            )}
        </div>
    )
}