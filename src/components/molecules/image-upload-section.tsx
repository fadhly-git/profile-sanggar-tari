"use client"

import { useState } from "react"
import { ExternalLink, Eye, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// Import komponen ImageUpload yang sudah ada
import { ImageUpload } from "@/components/molecules/image-upload" // Sesuaikan path dengan lokasi komponen Anda
import { isValidImageUrl } from "@/lib/validator" 

interface ImageUploadSectionProps {
  value: string
  onChange: (value: string) => void
  onPreviewChange: (preview: string) => void
  label?: string
  disabled?: boolean
}

export function ImageUploadSection({ 
  value, 
  onChange, 
  onPreviewChange, 
  label = "Gambar Latar",
  disabled = false 
}: ImageUploadSectionProps) {
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url')

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

  const clearImage = () => {
    onChange('')
    onPreviewChange('')
    if (uploadMethod === 'upload') {
      setUploadMethod('url')
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="background_image">{label}</Label>

        {/* Tab Selection */}
        <div className="flex border-b">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              uploadMethod === 'url'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setUploadMethod('url')}
            disabled={disabled}
          >
            URL Gambar
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              uploadMethod === 'upload'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setUploadMethod('upload')}
            disabled={disabled}
          >
            Unggah File
          </button>
        </div>

        {/* URL Input Method */}
        {uploadMethod === 'url' && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                id="background_image"
                name="background_image"
                value={value}
                onChange={(e) => {
                  onChange(e.target.value)
                  onPreviewChange(e.target.value)
                }}
                type="text"
                className="flex-1"
                disabled={disabled}
                helperText="https://contoh.com/gambar.jpg atau /images/gambar.jpg"
                error={!isValidImageUrl(value) && value ? "URL gambar tidak valid" : undefined}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => window.open('/admin/media', '_blank')}
                title="Buka Pustaka Media"
                disabled={disabled}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Masukkan URL gambar dari internet atau jalur gambar yang sudah ada
            </p>
          </div>
        )}

        {/* File Upload Method - Menggunakan komponen ImageUpload yang sudah ada */}
        {uploadMethod === 'upload' && (
          <div className="space-y-4">
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
              label="Seret dan lepas gambar di sini atau klik untuk memilih"
              accept="image/*"
              maxSizeMB={5}
              disabled={disabled}
              url={value}
              className="w-full"
            />

            <p className="text-xs text-muted-foreground">
              PNG, JPG, WebP hingga 5MB. Rekomendasi: 1920x1080px
            </p>
          </div>
        )}
      </div>

      {/* Image Preview - hanya tampil jika ada gambar dan method URL */}
      {value && uploadMethod === 'url' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Pratinjau Gambar</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearImage}
              disabled={disabled}
            >
              <X className="h-4 w-4 mr-1" />
              Hapus
            </Button>
          </div>
          <div className="relative rounded-lg border overflow-hidden group">
            <Image
              src={value}
              alt="Pratinjau"
              width={800}
              height={300}
              className="w-full h-48 object-cover"
              onError={() => {
                onChange('')
                onPreviewChange('')
                toast.error("Gagal memuat gambar")
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => window.open(value, '_blank')}
                disabled={disabled}
              >
                <Eye className="h-4 w-4 mr-1" />
                Lihat
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={clearImage}
                disabled={disabled}
              >
                <X className="h-4 w-4 mr-1" />
                Hapus
              </Button>
            </div>
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs">
                Pratinjau
              </Badge>
            </div>
          </div>
          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
            <span className="font-mono break-all">{value}</span>
          </div>
        </div>
      )}
    </div>
  )
}