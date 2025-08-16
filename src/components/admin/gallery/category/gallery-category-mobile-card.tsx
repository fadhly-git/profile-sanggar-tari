import { GalleryCategory } from '@prisma/client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface GalleryCategoryWithAuthor extends GalleryCategory {
  author: {
    id: string
    name: string
    email: string
  }
  _count: {
    items: number
  }
}

interface GalleryCategoryMobileCardProps {
  category: GalleryCategoryWithAuthor
  onView: (category: GalleryCategoryWithAuthor) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function GalleryCategoryMobileCard({
  category,
  onView,
  onEdit,
  onDelete
}: GalleryCategoryMobileCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-base leading-tight">
              {category.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {category.slug}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(category)}>
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(category.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(category.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {category.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {category.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={category.isActive ? "default" : "secondary"}>
                {category.isActive ? 'Aktif' : 'Tidak Aktif'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {category._count.items} item
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Urutan: {category.order}
            </span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Dibuat: {format(new Date(category.createdAt), 'dd MMM yyyy', { locale: id })}</p>
            <p>Oleh: {category.author.name}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}