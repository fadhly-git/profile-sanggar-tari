'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import {
    createGalleryCategory,
    updateGalleryCategory,
    generateSlugCategoryGallery
} from '@/lib/actions/gallery-category-actions'

interface GalleryCategory {
    id: string
    title: string
    slug: string
    description: string | null
    order: number
    isActive: boolean
}

interface GalleryCategoryFormProps {
    category?: GalleryCategory | null
    mode: 'create' | 'edit'
}

interface FormData {
    title: string
    slug: string
    description: string
    order: number
    isActive: boolean
}

export function GalleryCategoryForm({ category, mode, userId }: GalleryCategoryFormProps & { userId: string }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState<FormData>({
        title: category?.title || '',
        slug: category?.slug || '',
        description: category?.description || '',
        order: category?.order || 0,
        isActive: category?.isActive ?? true,
    })
    const [originalSlug] = useState(category?.slug || '')
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleGenerateSlug = async () => {
        if (!formData.title.trim()) {
            toast.error('Masukkan judul terlebih dahulu')
            return
        }

        try {
            const slug = await generateSlugCategoryGallery(formData.title)
            setFormData(prev => ({ ...prev, slug }))
            toast.success('Slug berhasil dibuat')
        } catch {
            toast.error('Gagal membuat slug')
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Judul wajib diisi'
        }

        if (!formData.slug.trim()) {
            newErrors.slug = 'Slug wajib diisi'
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        startTransition(async () => {
            try {
                const form = new FormData()
                form.append('title', formData.title)
                form.append('slug', formData.slug)
                form.append('description', formData.description)
                form.append('order', formData.order.toString())
                form.append('isActive', formData.isActive.toString())
                form.append('authorId', userId)

                if (mode === 'edit' && category) {
                    form.append('id', category.id)
                }

                setErrors({}) // Clear errors before submission

                if (mode === 'create') {
                    await createGalleryCategory(form)
                    toast.success('Kategori berhasil dibuat')
                } else if (category) {
                    await updateGalleryCategory(category.id, form)
                    toast.success('Kategori berhasil diupdate')
                }

                router.push('/admin/gallery/gallery-categories')
            } catch (error: unknown) {
                const errorMessage =
                    typeof error === 'object' && error !== null && 'message' in error
                        ? String((error as { message?: string }).message)
                        : `Gagal ${mode === 'create' ? 'membuat' : 'mengupdate'} kategori`
                toast.error(errorMessage)
            }
        })
    }

    const pageTitle = mode === 'create' ? 'Tambah Kategori Galeri' : 'Edit Kategori Galeri'
    const submitText = mode === 'create' ? 'Simpan Kategori' : 'Simpan Perubahan'
    const loadingText = mode === 'create' ? 'Menyimpan...' : 'Menyimpan...'

    return (
        <div className="container mx-auto py-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{pageTitle}</h1>
                        <p className="text-muted-foreground">
                            {mode === 'create'
                                ? 'Buat kategori baru untuk mengorganisir galeri'
                                : 'Perbarui informasi kategori galeri'
                            }
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Kategori</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title Input */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Kategori *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Masukkan judul kategori"
                                    className={errors.title ? 'border-red-500' : ''}
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500">{errors.title}</p>
                                )}
                            </div>

                            {/* Slug Input */}
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug *</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => handleInputChange('slug', e.target.value)}
                                    placeholder="slug-kategori"
                                    className={errors.slug ? 'border-red-500' : ''}
                                />
                                {errors.slug && (
                                    <p className="text-sm text-red-500">{errors.slug}</p>
                                )}
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        URL-friendly versi dari judul. Akan digunakan di URL website.
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleGenerateSlug}
                                        disabled={!formData.title.trim() || isPending}
                                    >
                                        <Wand2 className="mr-2 h-4 w-4" />
                                        Generate
                                    </Button>
                                </div>
                            </div>

                            {/* Description Input */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Deskripsi kategori (opsional)"
                                    rows={4}
                                />
                            </div>

                            {/* Order Input */}
                            <div className="space-y-2">
                                <Label htmlFor="order">Urutan</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Urutan tampil kategori. Semakin kecil angka, semakin atas posisinya.
                                </p>
                            </div>

                            {/* Active Switch */}
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                                />
                                <Label htmlFor="isActive">Kategori Aktif</Label>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="sm:order-2"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {isPending ? loadingText : submitText}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={isPending}
                                    className="sm:order-1"
                                >
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Warning Card for Edit Mode */}
                {mode === 'edit' && formData.slug !== originalSlug && (
                    <Card className="mt-6 border-yellow-200 dark:border-yellow-800">
                        <CardHeader>
                            <CardTitle className="text-yellow-800 dark:text-yellow-200 text-lg">
                                ⚠️ Peringatan Perubahan Slug
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-yellow-700 dark:text-yellow-300">
                            <p>
                                Anda mengubah slug dari{' '}
                                <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
                                    {originalSlug}
                                </code>{' '}
                                menjadi{' '}
                                <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
                                    {formData.slug}
                                </code>
                            </p>
                            <p className="mt-2">
                                Perubahan ini akan mengubah URL kategori. Pastikan untuk memperbarui
                                link yang mengarah ke kategori ini di website.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Tips Card */}
                <FormTips />
            </div>
        </div>
    )
}

// Tips Component (bisa dipisah ke file terpisah jika mau)
function FormTips() {
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="text-lg">Tips Penggunaan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• <strong>Judul:</strong> Gunakan nama yang jelas dan mudah dipahami</p>
                <p>• <strong>Slug:</strong> Akan menjadi bagian URL, sebaiknya pendek dan deskriptif</p>
                <p>• <strong>Urutan:</strong> Kategori dengan urutan lebih kecil akan ditampilkan lebih dulu</p>
                <p>• <strong>Status Aktif:</strong> Kategori tidak aktif tidak akan ditampilkan di website</p>
            </CardContent>
        </Card>
    )
}