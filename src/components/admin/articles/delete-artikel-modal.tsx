"use client"

import { useState } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteArtikelModalProps {
    articleId: string | null
    articleTitle: string
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
    onDelete: (id: string) => Promise<{ success: boolean; error?: string }>
}

export function DeleteArtikelModal({
    articleId,
    articleTitle,
    open,
    onOpenChange,
    onSuccess,
    onDelete
}: DeleteArtikelModalProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDelete = async () => {
        if (!articleId) return

        setIsDeleting(true)
        setError(null)

        try {
            const result = await onDelete(articleId)

            if (result.success) {
                onSuccess()
                onOpenChange(false)
            } else {
                setError(result.error || 'Gagal menghapus artikel')
            }
        } catch (error) {
            console.error('Error deleting article:', error)
            setError('Terjadi kesalahan saat menghapus artikel')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Artikel</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus artikel &quot;{articleTitle}&quot;?
                        Tindakan ini tidak dapat dibatalkan.
                        {error && (
                            <div className="mt-2 text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isDeleting ? 'Menghapus...' : 'Hapus'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}