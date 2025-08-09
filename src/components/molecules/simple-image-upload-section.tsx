"use client"

import { Label } from "@/components/ui/label"
import { toast } from "sonner"

// Import komponen ImageUpload yang sudah ada
import { ImageUpload } from "@/components/ui/image-upload"

interface SimpleImageUploadSectionProps {
  value: string
  onChange: (value: string) => void
  onPreviewChange: (preview: string) => void
  label?: string
  disabled?: boolean
  required?: boolean
}

export function SimpleImageUploadSection({ 
  value, 
  onChange, 
  onPreviewChange, 
  label = "Gambar Latar",
  disabled = false,
  required = false
}: SimpleImageUploadSectionProps) {
  
  const handleImageUpload = (url: string) => {
    onChange(url)
    onPreviewChange(url)
    toast.success('Gambar berhasil diunggah')
  }

  const handleImageRemove = () => {
    onChange('')
    onPreviewChange('')
    toast.success('Gambar berhasil dihapus')
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="background_image">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        
        {/* Hidden input untuk form submission */}
        <input
          type="hidden"
          name="background_image"
          value={value}
        />

        {/* Menggunakan komponen ImageUpload yang sudah ada */}
        <ImageUpload
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
          currentImage={value}
          label="Seret dan lepas gambar di sini atau klik untuk memilih file"
          accept="image/*"
          maxSizeMB={5}
          disabled={disabled}
          url={value}
          className="w-full"
        />
        
        <p className="text-xs text-muted-foreground">
          PNG, JPG, WebP hingga 5MB. Rekomendasi: 1920x1080px untuk hasil terbaik
        </p>
      </div>
    </div>
  )
}