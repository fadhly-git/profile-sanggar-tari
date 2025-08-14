// @/components/admin/gallery/gallery-form.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/atoms/input'
import { Textarea } from '@/components/atoms/textarea'
import { ImageUpload } from '@/components/molecules/image-upload'
import { ImageSelector } from '@/components/molecules/image-selector'
import { Separator } from '@/components/ui/separator'
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { GalleryItem, CreateGalleryItem, UpdateGalleryItem } from '@/types/gallery'
import { createGalleryItem, updateGalleryItem } from '@/lib/actions/gallery-actions'
import Image from 'next/image'

interface GalleryFormProps {
    item?: GalleryItem
    mode: 'create' | 'edit'
    userId: string
}

export function GalleryForm({ item, mode, userId }: GalleryFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const [formData, setFormData] = useState({
        title: item?.title || '',
        description: item?.description || '',
        imageUrl: item?.imageUrl || '',
        type: (item?.type || 'IMAGE') as 'IMAGE' | 'VIDEO',
        category: item?.category || '',
        isActive: item?.isActive ?? true
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Judul wajib diisi'
        }

        if (!formData.imageUrl.trim()) {
            newErrors.imageUrl = 'Gambar wajib dipilih'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Mohon lengkapi semua field yang wajib diisi')
            return
        }

        startTransition(async () => {
            try {
                let result

                if (mode === 'create') {
                    const createData: CreateGalleryItem = {
                        title: formData.title.trim(),
                        description: formData.description.trim() || null,
                        imageUrl: formData.imageUrl,
                        type: formData.type,
                        category: formData.category.trim() || null,
                        isActive: formData.isActive,
                        authorId: userId
                    }
                    result = await createGalleryItem(createData)
                } else {
                    const updateData: UpdateGalleryItem = {
                        id: item!.id,
                        title: formData.title.trim(),
                        description: formData.description.trim() || null,
                        imageUrl: formData.imageUrl,
                        type: formData.type,
                        category: formData.category.trim() || null,
                        isActive: formData.isActive
                    }
                    result = await updateGalleryItem(updateData)
                }

                if (result.success) {
                    toast.success(
                        mode === 'create'
                            ? 'Item galeri berhasil dibuat'
                            : 'Item galeri berhasil diperbarui'
                    )
                    router.push('/admin/gallery')
                } else {
                    toast.error(result.error)
                }
            } catch (error) {
                toast.error('Terjadi kesalahan, silakan coba lagi')
            }
        })
    }

    const handleImageUpload = (url: string) => {
        setFormData(prev => ({ ...prev, imageUrl: url }))
        if (errors.imageUrl) {
            setErrors(prev => ({ ...prev, imageUrl: '' }))
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>

                <div>
                    <h1 className="text-2xl font-bold">
                        {mode === 'create' ? 'Tambah Item Galeri' : 'Edit Item Galeri'}
                    </h1>
                    <p className="text-muted-foreground">
                        {mode === 'create'
                            ? 'Tambahkan item baru ke galeri'
                            : 'Perbarui informasi item galeri'
                        }
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Dasar</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input
                                    label="Judul"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    error={errors.title}
                                    required
                                    placeholder="Masukkan judul item galeri"
                                />

                                <Textarea
                                    label="Deskripsi"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Masukkan deskripsi item galeri (opsional)"
                                    rows={4}
                                    helperText="Deskripsi akan ditampilkan di detail item"
                                />

                                <Input
                                    label="Kategori"
                                    value={formData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    placeholder="Masukkan kategori (opsional)"
                                    helperText="Contoh: Wisata, Kuliner, Budaya"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" />
                                    Media
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">Tipe Media</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value: 'IMAGE' | 'VIDEO') =>
                                            setFormData(prev => ({ ...prev, type: value }))
                                        }
                                    >
                                        <SelectTrigger className="mt-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="IMAGE">Gambar</SelectItem>
                                            <SelectItem value="VIDEO">Video</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <ImageUpload
                                        onImageUpload={handleImageUpload}
                                        currentImage={formData.imageUrl}
                                        label="Upload Gambar Baru"
                                        maxSizeMB={5}
                                        disabled={isPending}
                                    />

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-2 text-muted-foreground">
                                                Atau
                                            </span>
                                        </div>
                                    </div>

                                    <ImageSelector
                                        label="Pilih dari Media Library"
                                        value={formData.imageUrl}
                                        onChange={handleImageUpload}
                                        helperText="Klik untuk membuka media library dan pilih gambar yang sudah ada"
                                    />

                                    {errors.imageUrl && (
                                        <p className="text-sm text-red-600">{errors.imageUrl}</p>
                                    )}
                                </div>

                                {formData.imageUrl && (
                                    <div className="mt-4">
                                        <Label className="text-sm font-medium">Preview</Label>
                                        <div className="mt-2 w-full max-w-md h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                            <Image
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder-image.png'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pengaturan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Status Publikasi</Label>
                                        <p className="text-sm text-muted-foreground">
                                            {formData.isActive ? 'Item akan ditampilkan' : 'Item akan disembunyikan'}
                                        </p>
                                    </div>
                                    <Switch
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) =>
                                            setFormData(prev => ({ ...prev, isActive: checked }))
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Bantuan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <div>
                                    <p className="font-medium">Upload Gambar:</p>
                                    <p>Klik area upload atau drag & drop gambar. Maksimal 5MB.</p>
                                </div>

                                <div>
                                    <p className="font-medium">Media Library:</p>
                                    <p>Akses semua gambar yang sudah diupload sebelumnya di <strong>/admin/media</strong></p>
                                </div>

                                <div>
                                    <p className="font-medium">Format yang Didukung:</p>
                                    <p>JPG, PNG, GIF, WebP</p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-2">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full"
                            >
                                {isPending ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        {mode === 'create' ? 'Menyimpan...' : 'Memperbarui...'}
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        {mode === 'create' ? 'Simpan Item' : 'Perbarui Item'}
                                    </>
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isPending}
                                className="w-full"
                            >
                                Batal
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}