'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/atoms/input'
import { Textarea } from '@/components/atoms/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { createFAQ, updateFAQ } from '@/lib/actions/faq-actions'
import { toast } from 'sonner'
import { FAQ } from '@prisma/client'

interface FAQFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    faq?: FAQ | null
    onSuccess?: () => void
}

export function FAQForm({ open, onOpenChange, faq, onSuccess }: FAQFormProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        question: faq?.question || '',
        answer: faq?.answer || '',
        order: faq?.order || 0,
        isActive: faq?.isActive ?? true
    })

    useEffect(() => {
        if (faq) {
            setFormData({
                question: faq.question,
                answer: faq.answer,
                order: faq.order,
                isActive: faq.isActive
            })
        } else {
            setFormData({
                question: '',
                answer: '',
                order: 0,
                isActive: true
            })
        }
    }, [faq]);

    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrors({})

        try {
            let result

            if (faq) {
                result = await updateFAQ(faq.id, formData)
            } else {
                result = await createFAQ(formData)
            }

            if (result.success) {
                toast.success(faq ? 'FAQ berhasil diperbarui' : 'FAQ berhasil dibuat')
                onOpenChange(false)
                onSuccess?.()

                // Reset form jika create
                if (!faq) {
                    setFormData({
                        question: '',
                        answer: '',
                        order: 0,
                        isActive: true
                    })
                }
            } else {
                toast.error(result.error || 'Terjadi kesalahan')
            }
        } catch (error) {
            console.error('Form submission error:', error)
            toast.error('Terjadi kesalahan saat menyimpan data')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {faq ? 'Edit FAQ' : 'Tambah FAQ Baru'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4">
                        <Input
                            label="Pertanyaan *"
                            value={formData.question}
                            onChange={(e) => handleInputChange('question', e.target.value)}
                            error={errors.question}
                            placeholder="Masukkan pertanyaan FAQ"
                            disabled={loading}
                        />

                        <Textarea
                            label="Jawaban *"
                            value={formData.answer}
                            onChange={(e) => handleInputChange('answer', e.target.value)}
                            error={errors.answer}
                            placeholder="Masukkan jawaban FAQ"
                            rows={6}
                            disabled={loading}
                        />

                        <Input
                            label="Urutan"
                            type="number"
                            value={formData.order}
                            onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                            error={errors.order}
                            placeholder="0"
                            helperText="Nomor urutan untuk mengurutkan FAQ"
                            disabled={loading}
                        />

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                                disabled={loading}
                            />
                            <Label htmlFor="isActive">Aktif</Label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Menyimpan...' : (faq ? 'Perbarui' : 'Simpan')}
                        </Button>
                    </div>
                </form>
                <DialogDescription>
                    {faq ? 'Edit FAQ yang dipilih' : 'Tambah FAQ baru'}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}