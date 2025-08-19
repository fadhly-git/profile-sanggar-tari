'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { BadgeStatus } from '@/components/atoms/badge-status'
import { FAQ } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

interface FAQDetailModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    faq: FAQ | null
}

export function FAQDetailModal({ open, onOpenChange, faq }: FAQDetailModalProps) {
    if (!faq) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detail FAQ</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="grid gap-4">
                        <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">
                                Status
                            </h4>
                            <BadgeStatus
                                status={faq.isActive ? 'success' : 'danger'}
                            >
                                {faq.isActive ? 'Aktif' : 'Tidak Aktif'}
                            </BadgeStatus>
                        </div>

                        <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">
                                Urutan
                            </h4>
                            <Badge variant="outline">{faq.order}</Badge>
                        </div>

                        <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">
                                Pertanyaan
                            </h4>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm leading-relaxed">{faq.question}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">
                                Jawaban
                            </h4>
                            <div className="p-4 bg-muted rounded-lg">
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                    <p className="whitespace-pre-wrap leading-relaxed">{faq.answer}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                                    Dibuat
                                </h4>
                                <p className="text-sm">
                                    {faq.createdAt ? formatDistanceToNow(new Date(faq.createdAt), {
                                        addSuffix: true,
                                        locale: id
                                    }) : 'Tanggal tidak tersedia'}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                                    Terakhir Diperbarui
                                </h4>
                                <p className="text-sm">
                                    {faq.updatedAt ? formatDistanceToNow(new Date(faq.updatedAt), {
                                        addSuffix: true,
                                        locale: id
                                    }) : 'Tanggal tidak tersedia'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogDescription className="mt-4 text-sm text-muted-foreground">
                    Informasi ini memberikan detail lengkap tentang FAQ yang dipilih, termasuk status, urutan, pertanyaan, jawaban, dan tanggal pembuatan serta pembaruan terakhir.
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
