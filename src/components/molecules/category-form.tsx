"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CategoryCard } from "./category-card"
import { Separator } from "@/components/ui/separator"
import { FolderTree, Menu, ToggleLeft, ListOrdered, Loader2 } from "lucide-react"
import { forwardRef } from "react"

interface CategoryFormData {
    nama_kategori: string
    slug_kategori: string
    keterangan: string | undefined
    parent_id: string | null
    urutan: number | null
    is_main_menu: boolean
    is_active: boolean
}

interface CategoryOption {
    id_kategori: string
    nama_kategori: string
}

interface CategoryFormProps {
    initialData?: Partial<CategoryFormData>
    kategoriesList: CategoryOption[]
    onActiveToggle?: (checked: boolean) => Promise<boolean>
    isCheckingDependencies?: boolean
    isEditMode?: boolean
}

export const CategoryForm = forwardRef<HTMLDivElement, CategoryFormProps>(({
    initialData,
    kategoriesList,
    onActiveToggle,
    isCheckingDependencies = false,
    isEditMode = false
}, ref) => {
    const [formData, setFormData] = useState<CategoryFormData>({
        nama_kategori: initialData?.nama_kategori || "",
        slug_kategori: initialData?.slug_kategori || "",
        keterangan: initialData?.keterangan || "",
        parent_id: initialData?.parent_id || null,
        urutan: initialData?.urutan || null,
        is_main_menu: initialData?.is_main_menu || false,
        is_active: initialData?.is_active ?? true,
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isActive, setIsActive] = useState(initialData?.is_active ?? true)
    // Update ketika initialData berubah
    useEffect(() => {
        if (initialData?.is_active !== undefined) {
            setIsActive(initialData.is_active)
        }
    }, [initialData?.is_active])

    const [slug, setSlug] = useState(initialData?.slug_kategori || "")

    const handleNamaChange = (value: string) => {
        const generatedSlug = value
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim()
        setSlug(generatedSlug)
        setFormData(prev => ({ ...prev, nama_kategori: value, slug_kategori: generatedSlug }))
    }

    const handleActiveToggle = async (checked: boolean) => {
        if (onActiveToggle) {
            const shouldProceed = await onActiveToggle(checked)
            if (checked || shouldProceed === false) {
                setFormData(prev => ({ ...prev, is_active: checked }))
            }
        } else {
            setFormData(prev => ({ ...prev, is_active: checked }))
        }
    }

    return (
        <div ref={ref} className="space-y-6">
            {/* Informasi Dasar */}
            <CategoryCard
                title="Informasi Dasar"
                description={isEditMode ? "Perbarui informasi dasar kategori" : "Masukkan informasi dasar kategori"}
            >
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="nama_kategori" className="text-sm">
                            Nama Kategori <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="nama_kategori"
                            name="nama_kategori"
                            placeholder="Contoh: Layanan Kesehatan"
                            defaultValue={initialData?.nama_kategori}
                            required
                            onChange={(e) => handleNamaChange(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug_kategori" className="text-sm">
                            Slug URL <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="slug_kategori"
                            name="slug_kategori"
                            placeholder="layanan-kesehatan"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            URL: /kategori/{slug || "slug-kategori"}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="keterangan" className="text-sm">Deskripsi</Label>
                    <Textarea
                        id="keterangan"
                        name="keterangan"
                        placeholder="Deskripsi singkat tentang kategori ini..."
                        defaultValue={initialData?.keterangan || ""}
                        rows={3}
                    />
                </div>
            </CategoryCard>

            {/* Hierarki & Pengaturan */}
            <CategoryCard
                title="Hierarki & Pengaturan"
                description="Atur posisi dan hierarki kategori"
            >
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="parent_id" className="text-sm">
                            <FolderTree className="inline mr-2 h-4 w-4" />
                            Kategori Induk
                        </Label>
                        <Select
                            name="parent_id"
                            defaultValue={initialData?.parent_id || "none"}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori induk (opsional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Tidak ada (Kategori Utama)</SelectItem>
                                {kategoriesList.map((kategori) => (
                                    <SelectItem
                                        key={kategori.id_kategori}
                                        value={kategori.id_kategori}
                                    >
                                        {kategori.nama_kategori}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Biarkan kosong untuk membuat kategori utama
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="urutan" className="text-sm">
                            <ListOrdered className="inline mr-2 h-4 w-4" />
                            Urutan Tampil
                        </Label>
                        <Input
                            id="urutan"
                            name="urutan"
                            type="number"
                            placeholder="1"
                            defaultValue={initialData?.urutan || ""}
                            min="1"
                        />
                        <p className="text-xs text-muted-foreground">
                            Urutan tampil dalam daftar kategori
                        </p>
                    </div>
                </div>
            </CategoryCard>

            {/* Status & Visibilitas */}
            <CategoryCard
                title="Status & Visibilitas"
                description="Kontrol visibilitas kategori di website"
            >
                <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <Checkbox
                            id="is_main_menu"
                            name="is_main_menu"
                            defaultChecked={initialData?.is_main_menu}
                        />
                        <div className="space-y-1 flex-1">
                            <Label
                                htmlFor="is_main_menu"
                                className="flex items-center cursor-pointer text-sm"
                            >
                                <Menu className="mr-2 h-4 w-4" />
                                Tampilkan di Menu Utama
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Kategori akan muncul di navigasi utama website
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-start space-x-3">
                        <Checkbox
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onCheckedChange={handleActiveToggle}
                            disabled={isCheckingDependencies}
                        />
                        {/* Hidden input to ensure checkbox value is submitted */}
                        <input
                            type="hidden"
                            name="is_active"
                            value={formData.is_active ? "true" : "false"}
                        />
                        <div className="space-y-1 flex-1">
                            <Label
                                htmlFor="is_active"
                                className="flex items-center cursor-pointer text-sm"
                            >
                                <ToggleLeft className="mr-2 h-4 w-4" />
                                Status Aktif
                                {isCheckingDependencies && (
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                )}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Nonaktifkan untuk menyembunyikan kategori dari publik
                            </p>
                        </div>
                    </div>
                </div>
            </CategoryCard>
        </div>
    )
})

CategoryForm.displayName = "CategoryForm"