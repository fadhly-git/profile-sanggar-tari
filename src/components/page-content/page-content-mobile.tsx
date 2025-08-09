"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { BadgeStatus } from '@/components/atoms/badge-status'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, Edit, Trash2, MoreVertical } from "lucide-react"
import { PageContent, getPageKeyLabel } from "@/types/page-content"
import { deletePageContent } from "@/lib/page-content/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PageContentMobileProps {
    data: PageContent[]
}

export function PageContentMobile({ data }: PageContentMobileProps) {
    const [selectedContent, setSelectedContent] = useState<PageContent | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const router = useRouter()

    const handleDelete = async (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus konten halaman ini?')) {
            const result = await deletePageContent(id)
            if (result.success) {
                toast.success('Konten halaman berhasil dihapus')
            } else {
                toast.error(result.error || 'Gagal menghapus konten halaman')
            }
        }
    }

    const handleViewDetail = (content: PageContent) => {
        setSelectedContent(content)
        setShowDetailModal(true)
    }

    return (
        <>
            <div className="grid gap-4">
                {data.map((content) => (
                    <Card key={content.id} className="relative">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-base leading-none">
                                        {content.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {getPageKeyLabel(content.pageKey)}
                                    </p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleViewDetail(content)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Lihat Detail
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => router.push(`/admin/page-content/edit/${content.id}`)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(content.id)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <BadgeStatus status={content.isActive ? "success" : "info"}>
                                    {content.isActive ? "Aktif" : "Nonaktif"}
                                </BadgeStatus>
                                <p className="text-xs text-muted-foreground">
                                    {format(new Date(content.updatedAt), "dd MMM yyyy", { locale: id })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
                <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detail Konten Halaman</DialogTitle>
                    </DialogHeader>
                    {selectedContent && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-sm text-muted-foreground">Halaman</h3>
                                <p>{getPageKeyLabel(selectedContent.pageKey)}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-muted-foreground">Judul</h3>
                                <p>{selectedContent.title}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-muted-foreground">Konten</h3>
                                <div
                                    className="prose prose-sm max-w-none dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: selectedContent.content }}
                                />
                            </div>
                            {selectedContent.metadata && (
                                <div>
                                    <h3 className="font-semibold text-sm text-muted-foreground">Metadata</h3>
                                    <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                                        {selectedContent.metadata}
                                    </pre>
                                </div>
                            )}
                            <div className="flex gap-4">
                                <div>
                                    <h3 className="font-semibold text-sm text-muted-foreground">Status</h3>
                                    <BadgeStatus status={selectedContent.isActive ? "success" : "info"}>
                                        {selectedContent.isActive ? "Aktif" : "Nonaktif"}
                                    </BadgeStatus>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-muted-foreground">Terakhir Diubah</h3>
                                    <p className="text-sm">
                                        {format(new Date(selectedContent.updatedAt), "dd MMMM yyyy 'pukul' HH:mm", { locale: id })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}