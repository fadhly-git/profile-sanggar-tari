"use client"

import { Input } from "@/components/ui/input"

interface SearchInputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SearchInput({ 
  placeholder = "Cari...", 
  value, 
  onChange,
  className = "max-w-sm w-full sm:w-auto"
}: SearchInputProps) {
  return (
    <div className={className}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}