'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/atoms/input'
import { Textarea } from '@/components/atoms/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Calendar, Clock, MapPin, Repeat } from 'lucide-react'
import { createScheduleEvent, updateScheduleEvent } from '@/lib/actions/schedule-actions'
import { ScheduleEvent, ScheduleFormData } from '@/types/schedule'
import { RecurringType } from '@prisma/client'
import { toast } from 'sonner'
import { DateTimePicker } from '@/components/molecules/datetime-picker'

interface ScheduleFormProps {
    event?: ScheduleEvent
    onSuccess?: () => void
    authorId: string
}

const initialFormData: ScheduleFormData = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    isRecurring: false,
    recurringType: null,
}

export function ScheduleForm({ event, onSuccess, authorId }: ScheduleFormProps) {
    const [formData, setFormData] = useState<ScheduleFormData>(
        event ? {
            title: event.title,
            description: event.description || '',
            startDate: new Date(event.startDate).toISOString().slice(0, 16),
            endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
            location: event.location || '',
            isRecurring: event.isRecurring,
            recurringType: event.recurringType,
        } : initialFormData
    )

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Judul kegiatan wajib diisi'
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Tanggal mulai wajib diisi'
        }

        if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
            newErrors.endDate = 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai'
        }

        if (formData.isRecurring && !formData.recurringType) {
            newErrors.recurringType = 'Tipe pengulangan wajib dipilih jika kegiatan berulang'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        try {
            const submitData = {
                title: formData.title,
                description: formData.description || undefined,
                startDate: new Date(formData.startDate),
                endDate: formData.endDate ? new Date(formData.endDate) : undefined,
                location: formData.location || undefined,
                isActive: true,
                isRecurring: formData.isRecurring,
                recurringType: formData.isRecurring ? formData.recurringType : undefined,
                authorId,
            }

            let result
            if (event) {
                result = await updateScheduleEvent(event.id, submitData)
            } else {
                result = await createScheduleEvent(submitData)
            }

            if (result.success) {
                toast.success(result.message)
                if (!event) {
                    setFormData(initialFormData)
                    setErrors({})
                }
                onSuccess?.()
            } else {
                toast.error(result.message)
            }
        } catch {
            toast.error('Terjadi kesalahan')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: keyof ScheduleFormData, value: string | boolean | RecurringType) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value }
            // Reset recurringType when isRecurring is set to false
            if (field === 'isRecurring' && !value) {
                newData.recurringType = null
            }
            return newData
        })
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {event ? 'Edit Jadwal Kegiatan' : 'Tambah Jadwal Kegiatan'}
                </CardTitle>
            </CardHeader>
            <CardContent className='max-w-2xl mx-auto'>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Judul Kegiatan"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        error={errors.title}
                        placeholder="Masukkan judul kegiatan"
                        required
                    />

                    <Textarea
                        label="Deskripsi"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        error={errors.description}
                        placeholder="Masukkan deskripsi kegiatan (opsional)"
                        rows={3}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="startDate" className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4" />
                                Tanggal & Waktu Mulai
                            </Label>
                            <DateTimePicker
                                dateTime={formData.startDate ? new Date(formData.startDate) : undefined}
                                onDateTimeChange={(datetime) => handleInputChange('startDate', datetime ? datetime.toISOString().slice(0, 16) : '')}
                                error={errors.startDate}
                                format12h={false}
                                placeholder="Pilih tanggal & waktu mulai"
                            />
                        </div>

                        <div>
                            <Label htmlFor="endDate" className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4" />
                                Tanggal & Waktu Selesai
                            </Label>
                            <DateTimePicker
                                dateTime={formData.endDate ? new Date(formData.endDate) : undefined}
                                onDateTimeChange={(datetime) => handleInputChange('endDate', datetime ? datetime.toISOString().slice(0, 16) : '')}
                                error={errors.endDate}
                                format12h={false}
                                placeholder="Pilih tanggal & waktu selesai"
                                helperText="Opsional, biarkan kosong"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="location" className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4" />
                            Lokasi (Embed Google Maps)
                        </Label>
                        <Textarea
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            error={errors.location}
                            placeholder='Paste embed code dari Google Maps, contoh: <iframe src="https://www.google.com/maps/embed?pb=..." width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
                            rows={3}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isRecurring"
                                checked={formData.isRecurring}
                                onCheckedChange={(checked) => handleInputChange('isRecurring', !!checked)}
                            />
                            <Label htmlFor="isRecurring" className="flex items-center gap-2">
                                <Repeat className="h-4 w-4" />
                                Kegiatan Berulang
                            </Label>
                        </div>

                        {formData.isRecurring && (
                            <div>
                                <Label className='mb-2'>Tipe Pengulangan</Label>
                                <Select
                                    value={formData.recurringType || undefined}
                                    onValueChange={(value) => handleInputChange('recurringType', value as RecurringType)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih tipe pengulangan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="WEEKLY">Mingguan</SelectItem>
                                        <SelectItem value="MONTHLY">Bulanan</SelectItem>
                                        <SelectItem value="YEARLY">Tahunan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.recurringType && (
                                    <p className="text-sm text-red-500 mt-1">{errors.recurringType}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Menyimpan...' : event ? 'Perbarui' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}