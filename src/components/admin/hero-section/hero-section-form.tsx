'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageSelector } from '@/components/molecules/image-selector'
import { ImageUpload } from '@/components/molecules/image-upload'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ArrowLeft, Info, Image as ImageIcon, Link } from 'lucide-react'
import { createHeroSection, updateHeroSection, type HeroSectionFormData } from '@/lib/actions/hero-section-actions'
import { toast } from 'sonner'
import Image from 'next/image'

export interface HeroSection {
    id: string
    imageUrl: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

interface HeroSectionFormProps {
    heroSection?: HeroSection
    mode: 'create' | 'edit'
}

export function HeroSectionForm({ heroSection, mode }: HeroSectionFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageUrl, setImageUrl] = useState(heroSection?.imageUrl || '')
    const [isActive, setIsActive] = useState(heroSection?.isActive ?? true)
    const [activeTab, setActiveTab] = useState<'upload' | 'selector'>('upload')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!imageUrl.trim()) {
            toast.error('URL gambar harus diisi')
            return
        }

        setIsSubmitting(true)

        try {
            const formData: HeroSectionFormData = {
                imageUrl: imageUrl.trim(),
                isActive,
            }

            const result = mode === 'create'
                ? await createHeroSection(formData)
                : await updateHeroSection(heroSection!.id, formData)

            if (result.success) {
                toast.success(
                    mode === 'create'
                        ? 'Hero section berhasil dibuat'
                        : 'Hero section berhasil diperbarui'
                )
                router.push('/admin/hero-sections')
                router.refresh()
            } else {
                toast.error(result.error || 'Terjadi kesalahan')
            }
        } catch (error) {
            toast.error('Terjadi kesalahan yang tidak terduga', {
                description: (error as Error).message
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleImageUpload = (url: string) => {
        setImageUrl(url)
        toast.success('Gambar berhasil diupload')
    }

    const handleImageRemove = () => {
        setImageUrl('')
        toast.success('Gambar berhasil dihapus')
    }

    return (
        <div className="space-y-6">
            {/* Header */}
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
                    <h1 className="text-3xl font-bold tracking-tight">
                        {mode === 'create' ? 'Tambah Hero Section' : 'Edit Hero Section'}
                    </h1>
                    <p className="text-muted-foreground">
                        {mode === 'create'
                            ? 'Buat hero section baru untuk beranda website'
                            : 'Perbarui informasi hero section'
                        }
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gambar Hero Section</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upload' | 'selector')}>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="upload" className="flex items-center gap-2">
                                            <ImageIcon className="h-4 w-4" />
                                            Upload Gambar
                                        </TabsTrigger>
                                        <TabsTrigger value="selector" className="flex items-center gap-2">
                                            <Link className="h-4 w-4" />
                                            Pilih dari Media
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="upload" className="space-y-4">
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertDescription>
                                                Upload gambar baru atau masukkan URL gambar. Ukuran maksimal 5MB.
                                            </AlertDescription>
                                        </Alert>

                                        <ImageUpload
                                            label="Upload Gambar Hero Section"
                                            currentImage={imageUrl}
                                            onImageUpload={handleImageUpload}
                                            onImageRemove={handleImageRemove}
                                            maxSizeMB={5}
                                            accept="image/*"
                                            className="w-full"
                                        />
                                    </TabsContent>

                                    <TabsContent value="selector" className="space-y-4">
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertDescription>
                                                Pilih gambar dari koleksi media yang sudah ada. Klik tombol &quot;Buka Media&quot; untuk melihat semua gambar yang tersedia di folder uploads.
                                            </AlertDescription>
                                        </Alert>

                                        <ImageSelector
                                            label="Pilih Gambar dari Media"
                                            value={imageUrl}
                                            onChange={setImageUrl}
                                            helperText="Pilih gambar dari galeri media atau masukkan URL secara manual"
                                            required
                                        />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Pengaturan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isActive"
                                        checked={isActive}
                                        onCheckedChange={(checked) => setIsActive(checked as boolean)}
                                    />
                                    <label
                                        htmlFor="isActive"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Aktifkan hero section ini
                                    </label>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Hero section yang aktif akan ditampilkan di beranda website
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Preview */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {imageUrl ? (
                                    <div className="space-y-4">
                                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                            <Image
                                                src={imageUrl}
                                                alt="Preview Hero Section"
                                                className="h-full w-full object-cover"
                                                width={800}
                                                height={450}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement
                                                    target.style.display = 'none'
                                                    target.nextElementSibling?.classList.remove('hidden')
                                                }}
                                            />
                                            <div className="hidden absolute inset-0 items-center justify-center bg-muted">
                                                <div className="text-center text-muted-foreground">
                                                    <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                                                    <p className="text-sm">Gambar tidak dapat dimuat</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Status:</span>
                                                <span className={isActive ? 'text-green-600' : 'text-red-600'}>
                                                    {isActive ? 'Aktif' : 'Tidak Aktif'}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-muted-foreground">URL:</span>
                                                <p className="break-all text-xs bg-muted p-2 rounded">
                                                    {imageUrl}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-video w-full flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                                        <div className="text-center text-muted-foreground">
                                            <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                                            <p className="text-sm">Preview gambar akan muncul di sini</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Petunjuk Penggunaan Media</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground space-y-2">
                                <p>
                                    <strong>Tab Upload Gambar:</strong> Upload gambar baru dari komputer Anda atau masukkan URL gambar secara manual.
                                </p>
                                <p>
                                    <strong>Tab Pilih dari Media:</strong> Klik &quot;Buka Media&quot; untuk melihat semua gambar yang tersedia di folder uploads. Pilih gambar yang ingin digunakan.
                                </p>
                                <p>
                                    <strong>Format yang didukung:</strong> JPG, PNG, GIF, WebP dengan maksimal ukuran 5MB.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || !imageUrl.trim()}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {mode === 'create' ? 'Simpan Hero Section' : 'Perbarui Hero Section'}
                    </Button>
                </div>
            </form>
        </div>
    )
}