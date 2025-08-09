import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface KategoriOption {
    id_kategori: string
    nama_kategori: string
}

interface DependencyOptionsProps {
    handleOption: string
    onOptionChange: (value: string) => void
    migrateToCategory: string
    onMigrateCategoryChange: (value: string) => void
    kategoriesList: KategoriOption[]
    currentKategoriId: string
}

export function DependencyOptions({
    handleOption,
    onOptionChange,
    migrateToCategory,
    onMigrateCategoryChange,
    kategoriesList,
    currentKategoriId
}: DependencyOptionsProps) {
    return (
        <div className="space-y-4">
            <h4 className="text-sm font-medium">Pilih tindakan:</h4>
            <RadioGroup value={handleOption} onValueChange={onOptionChange}>
                <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                        <RadioGroupItem value="deactivate" id="deactivate" className="mt-1" />
                        <div className="flex-1 min-w-0">
                            <Label htmlFor="deactivate" className="cursor-pointer text-sm">
                                <div>
                                    <p className="font-medium">Nonaktifkan semua konten</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Kategori dan semua konten terkait akan dinonaktifkan
                                    </p>
                                </div>
                            </Label>
                        </div>
                    </div>

                    <div className="flex items-start space-x-2">
                        <RadioGroupItem value="migrate" id="migrate" className="mt-1" />
                        <div className="flex-1 min-w-0">
                            <Label htmlFor="migrate" className="cursor-pointer text-sm">
                                <div>
                                    <p className="font-medium">Pindahkan konten ke kategori lain</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Konten akan dipindahkan ke kategori yang Anda pilih
                                    </p>
                                </div>
                            </Label>
                        </div>
                    </div>

                    {handleOption === "migrate" && (
                        <div className="ml-6 space-y-2">
                            <Label htmlFor="migrate_category" className="text-sm">
                                Kategori Tujuan:
                            </Label>
                            <Select
                                value={migrateToCategory}
                                onValueChange={onMigrateCategoryChange}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih kategori tujuan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kategoriesList
                                        .filter(cat => cat.id_kategori !== currentKategoriId)
                                        .map((kategori) => (
                                            <SelectItem
                                                key={kategori.id_kategori}
                                                value={kategori.id_kategori}
                                            >
                                                {kategori.nama_kategori}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="flex items-start space-x-2">
                        <RadioGroupItem value="keep" id="keep" className="mt-1" />
                        <div className="flex-1 min-w-0">
                            <Label htmlFor="keep" className="cursor-pointer text-sm">
                                <div>
                                    <p className="font-medium">Hanya nonaktifkan kategori</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Kategori dinonaktifkan, konten tetap aktif
                                    </p>
                                </div>
                            </Label>
                        </div>
                    </div>
                </div>
            </RadioGroup>
        </div>
    )
}