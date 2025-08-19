'use client'

import { FAQ } from '@prisma/client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { BadgeStatus } from '@/components/atoms/badge-status'
import { StatusBadge } from '@/components/atoms/badge-status'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface FAQMobileCardProps {
    faq: FAQ
    onView: (faq: FAQ) => void
    onEdit: (faq: FAQ) => void
    onDelete: (faq: FAQ) => void
}

export function FAQMobileCard({ faq, onView, onEdit, onDelete }: FAQMobileCardProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                            <Badge variant="outline" className="text-xs">
                                Urutan {faq.order}
                            </Badge>
                            <BadgeStatus status={faq.isActive ? 'success' : 'danger'}>
                                {faq.isActive ? 'Aktif' : 'Tidak Aktif'}
                            </BadgeStatus>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-1">
                                Pertanyaan
                            </h4>
                            <StatusBadge text={faq.question} maxLength={80} />
                        </div>

                        <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-1">
                                Jawaban
                            </h4>
                            <StatusBadge text={faq.answer} maxLength={100} />
                        </div>

                        <div className="text-xs text-muted-foreground">
                            {format(new Date(faq.createdAt), 'dd MMM yyyy', { locale: id })}
                        </div>
                    </CardContent>
                </Card>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48">
                <DropdownMenuItem onClick={() => onView(faq)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(faq)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onDelete(faq)}
                    className="text-red-600 focus:text-red-600"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}