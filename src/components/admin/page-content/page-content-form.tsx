"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/atoms/input"
import { Textarea } from "@/components/atoms/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/editor/TiptapEditor"
import { createPageContent, updatePageContent } from "@/lib/page-content/actions"
import { PageContent } from "@/types/page-content"
import { toast } from "sonner"
import { ArrowLeft, Eye, Save } from "lucide-react"

interface PageContentFormProps {
    initialData?: PageContent
    mode: 'create' | 'edit'
}

interface FormValues {
    pageKey: string;
    title: string;
    content: string;
    metadata?: string;
    isActive: boolean;
}

export function PageContentForm({ initialData, mode }: PageContentFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        pageKey: initialData?.pageKey || '',
        title: initialData?.title || '',
        content: initialData?.content || '',
        metadata: initialData?.metadata || '',
        isActive: initialData?.isActive ?? true
    })

    // Fungsi untuk normalisasi pageKey (misalnya jadi slug: lowercase, ganti spasi jadi hyphen)
    const normalizePageKey = (key: string) => {
        return key.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };

    const handlePageKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const normalized = normalizePageKey(e.target.value);
        setFormData(prev => ({ ...prev, pageKey: normalized }));
    };

    const handlePreview = (values: FormValues) => {
        sessionStorage.setItem(
            'pageContentPreview',
            JSON.stringify({
                ...values,
                id: initialData?.id || undefined,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })
        );
        window.open(`/admin/page-content/preview/${values.pageKey}`, '_blank');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formDataObj = new FormData()
            formDataObj.append('pageKey', formData.pageKey)
            formDataObj.append('title', formData.title)
            formDataObj.append('content', formData.content)
            formDataObj.append('metadata', formData.metadata)
            formDataObj.append('isActive', formData.isActive.toString())

            let result
            if (mode === 'create') {
                result = await createPageContent(formDataObj)
            } else if (initialData) {
                result = await updatePageContent(initialData.id, formDataObj)
            }

            if (result && !result.success) {
                toast.error(result.error)
            } else {
                toast.success(mode === 'create' ? 'Halaman baru berhasil dibuat' : 'Halaman berhasil diperbarui');
                router.back(); // Opsional: kembali ke list setelah submit
            }
        } catch (error) {
            console.error('Form submission error:', error)
            toast.error('Terjadi kesalahan saat menyimpan data')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">
                    {mode === 'create' ? 'Tambah Konten Halaman' : 'Edit Konten Halaman'}
                </h1>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handlePreview(formData)} disabled={isLoading}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Dasar</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Input
                                        label="Page Key (Slug)"
                                        id="pageKey"
                                        value={formData.pageKey}
                                        onChange={handlePageKeyChange}
                                        placeholder="Masukkan key halaman (contoh: about-us)"
                                        required
                                        disabled={mode === 'edit'} // Disabled di mode edit agar tidak bisa ubah key
                                        helperText="Key unik untuk halaman, otomatis menjadi lowercase dan hyphenated."
                                    />
                                </div>

                                <Input
                                    label="Judul"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    required
                                    placeholder="Masukkan judul halaman"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Konten Halaman</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Gunakan editor untuk memformat konten. Anda dapat menambahkan gambar dengan menggunakan tombol upload atau memilih dari media yang sudah ada di <strong>/admin/media</strong>.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <RichTextEditor
                                    content={formData.content}
                                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                                    placeholder="Masukkan konten halaman..."
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Metadata (Opsional)</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Data tambahan dalam format JSON untuk informasi seperti alamat, telepon, dll.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    label="Metadata"
                                    value={formData.metadata}
                                    onChange={(e) => setFormData(prev => ({ ...prev, metadata: e.target.value }))}
                                    placeholder='{"alamat": "...", "telepon": "...", "email": "..."}'
                                    rows={4}
                                    helperText="Format JSON untuk data tambahan"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pengaturan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="isActive"
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                                    />
                                    <Label htmlFor="isActive">Aktif</Label>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Bantuan Upload Gambar</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <div>
                                    <h4 className="font-medium text-foreground">Cara Upload Gambar:</h4>
                                    <ol className="list-decimal list-inside space-y-1 mt-2">
                                        <li>Klik tombol gambar di toolbar editor</li>
                                        <li>Pilih &quot;Upload Gambar Baru&quot; atau &quot;Pilih dari Media&quot;</li>
                                        <li>Untuk media yang ada, kunjungi halaman <strong>/admin/media</strong></li>
                                    </ol>
                                </div>

                                <div>
                                    <h4 className="font-medium text-foreground">Format yang Didukung:</h4>
                                    <p>JPG, PNG, GIF, WEBP (maksimal 5MB)</p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-foreground">Tips:</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Gunakan gambar berkualitas tinggi</li>
                                        <li>Optimimalkan ukuran untuk web</li>
                                        <li>Berikan alt text yang deskriptif</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-2">
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        {mode === 'create' ? 'Simpan' : 'Perbarui'}
                                    </>
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isLoading}
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