"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/atoms/input"
import { Textarea } from "@/components/atoms/textarea"
import { ImageSelector } from "@/components/molecules/image-selector"
import { RichTextEditor } from "@/components/editor/TiptapEditor"
import { generateSlug } from "@/lib/utils"
import { Article } from "./artikel-columns"
import { ArrowLeft, Save, Eye } from "lucide-react"

interface ArtikelFormProps {
    article?: Article
    authorId: string
    onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>
}

export function ArtikelForm({ article, authorId, onSubmit }: ArtikelFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({
        title: article?.title || '',
        slug: article?.slug || '',
        excerpt: article?.excerpt || '',
        content: article?.content || '',
        featuredImage: article?.featuredImage || '',
        status: article?.status || 'DRAFT' as const
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Auto generate slug dari title
    useEffect(() => {
        if (!article) { // Only auto-generate for new articles
            setFormData(prev => ({ ...prev, slug: generateSlug(formData.title) }))
        }
    }, [formData.title, article])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Judul artikel wajib diisi'
        }

        if (!formData.slug.trim()) {
            newErrors.slug = 'Slug wajib diisi'
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Konten artikel wajib diisi'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        startTransition(async () => {
            try {
                const form = new FormData()
                form.append('title', formData.title)
                form.append('slug', formData.slug)
                form.append('excerpt', formData.excerpt || '')
                form.append('content', formData.content)
                form.append('featuredImage', formData.featuredImage || '')
                form.append('status', formData.status)
                form.append('authorId', authorId)
                
                if (article) {
                    form.append('id', article.id)
                }

                const result = await onSubmit(form)
                
                if (result.success) {
                    router.push('/admin/articles')
                } else {
                    setErrors({ submit: result.error || 'Terjadi kesalahan saat menyimpan artikel' })
                }
            } catch (error) {
                console.error('Error saving article:', error)
                setErrors({ submit: 'Terjadi kesalahan saat menyimpan artikel' })
            }
        })
    }

    const handlePreview = () => {
        window.open(`/preview/${formData.slug}`, '_blank')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                    <h1 className="text-2xl font-bold">
                        {article ? 'Edit Artikel' : 'Buat Artikel Baru'}
                    </h1>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePreview}
                        disabled={!formData.title || !formData.content}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                    </Button>
                    <Button
                        form="artikel-form"
                        type="submit"
                        disabled={isPending}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {isPending ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </div>
            </div>

            {/* Petunjuk Penggunaan Media */}
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
                <CardContent className="pt-6">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        💡 Tips Penggunaan Media
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Klik &quot;Pilih dari Media&quot; pada field Gambar Utama untuk memilih dari galeri</li>
                        <li>• Galeri media menampilkan semua gambar di folder /public/uploads</li>
                        <li>• Anda bisa upload gambar baru atau pilih yang sudah ada</li>
                        <li>• Untuk gambar dalam konten, gunakan fitur upload di editor teks</li>
                    </ul>
                </CardContent>
            </Card>

            <form id="artikel-form" onSubmit={handleSubmit} className="space-y-6">
                {errors.submit && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                        {errors.submit}
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Artikel</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input
                                    label="Judul Artikel"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    error={errors.title}
                                    placeholder="Masukkan judul artikel..."
                                    required
                                />

                                <Input
                                    label="Slug URL"
                                    value={formData.slug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                    error={errors.slug}
                                    helperText="URL artikel (otomatis dibuat dari judul)"
                                    placeholder="url-artikel"
                                    required
                                />

                                <Textarea
                                    label="Ringkasan"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                    placeholder="Ringkasan singkat artikel..."
                                    helperText="Ringkasan akan ditampilkan di halaman daftar artikel"
                                    rows={3}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Konten Artikel</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RichTextEditor
                                    content={formData.content}
                                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                                    placeholder="Tulis konten artikel di sini..."
                                />
                                {errors.content && (
                                    <p className="text-sm text-destructive mt-2">{errors.content}</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Gambar Utama</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ImageSelector
                                    label="Gambar Utama Artikel"
                                    value={formData.featuredImage}
                                    onChange={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                                    helperText="Gambar ini akan ditampilkan sebagai thumbnail artikel"
                                />
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
                                <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') =>
                                            setFormData(prev => ({ ...prev, status: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DRAFT">Draft</SelectItem>
                                            <SelectItem value="PUBLISHED">Dipublikasi</SelectItem>
                                            <SelectItem value="ARCHIVED">Diarsipkan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    )
}