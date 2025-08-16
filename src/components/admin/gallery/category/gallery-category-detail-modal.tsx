import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface GalleryCategoryWithAuthor {
  id: string
  title: string
  slug: string
  description: string | null
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string
    email: string
  }
  _count: {
    items: number
  }
}

interface GalleryCategoryDetailModalProps {
  isOpen: boolean
  onClose: () => void
  category: GalleryCategoryWithAuthor | null
}

export function GalleryCategoryDetailModal({
  isOpen,
  onClose,
  category
}: GalleryCategoryDetailModalProps) {
  if (!category) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Kategori Galeri</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Judul
              </h4>
              <p className="text-base">{category.title}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Slug
              </h4>
              <p className="md:text-base font-mono text-sm bg-muted px-2 py-1 rounded">
                {category.slug}
              </p>
            </div>
          </div>

          {category.description && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Deskripsi
              </h4>
              <p className="text-base">{category.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Status
              </h4>
              <Badge variant={category.isActive ? "default" : "secondary"}>
                {category.isActive ? 'Aktif' : 'Tidak Aktif'}
              </Badge>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Urutan
              </h4>
              <p className="text-base">{category.order}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Jumlah Item
              </h4>
              <p className="text-base">{category._count.items} item</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Dibuat Tanggal
              </h4>
              <p className="text-base">
                {format(new Date(category.createdAt), 'dd MMMM yyyy, HH:mm', { locale: id })}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Terakhir Diupdate
              </h4>
              <p className="text-base">
                {format(new Date(category.updatedAt), 'dd MMMM yyyy, HH:mm', { locale: id })}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">
              Dibuat Oleh
            </h4>
            <div className="flex items-center gap-2">
              <p className="text-base">{category.author.name}</p>
              <span className="text-sm text-muted-foreground">
                ({category.author.email})
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}