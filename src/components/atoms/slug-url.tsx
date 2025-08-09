import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SlugInputProps {
    value: string
    onChange: (value: string) => void
    required?: boolean
    placeholder?: string
}

export function SlugInput({ value, onChange, required, placeholder }: SlugInputProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="slug_kategori">
                Slug URL {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
                id="slug_kategori"
                name="slug_kategori"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
            />
            <p className="text-xs text-muted-foreground">
                URL: /kategori/{value || "slug-kategori"}
            </p>
        </div>
    )
}