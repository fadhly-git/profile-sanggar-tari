// src/components/admin/artikel/delete-artikel-modal.tsx
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
import { useState } from "react"
import { prisma } from "@/lib/prisma"

interface DeleteArtikelModalProps {
    articleId: string | null
    articleTitle: string
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function DeleteArtikelModal({
    articleId,
    articleTitle,
    open,
    onOpenChange,
    onSuccess
}: DeleteArtikelModalProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!articleId) return

        setIsDeleting(true)
        try {
            await prisma.article.delete({
                where: { id: articleId }
            })
            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error('Error deleting article:', error)
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