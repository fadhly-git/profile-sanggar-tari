"use client"

import { useState } from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/molecules/data-table"
import { BadgeStatus } from '@/components/atoms/badge-status'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { PageContent, getPageKeyLabel } from "@/types/page-content"
import { deletePageContent, togglePageContentStatus } from "@/lib/page-content/actions"
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

interface PageContentTableProps {
  data: PageContent[]
}

export function PageContentTable({ data }: PageContentTableProps) {
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

  const handleToggleStatus = async (id: string) => {
    const result = await togglePageContentStatus(id)
    if (result.success) {
      toast.success('Status berhasil diubah')
    } else {
      toast.error(result.error || 'Gagal mengubah status')
    }
  }

  const handleViewDetail = (content: PageContent) => {
    setSelectedContent(content)
    setShowDetailModal(true)
  }

  const columns: ColumnDef<PageContent>[] = [
    {
      accessorKey: "pageKey",
      header: "Halaman",
      cell: ({ row }) => (
        <div className="font-medium">
          {getPageKeyLabel(row.getValue("pageKey"))}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Judul",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate" title={row.getValue("title")}>
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <BadgeStatus status={row.getValue("isActive") ? "success" : "info"} onClick={() => handleToggleStatus(row.original.id)}>
          {row.getValue("isActive") ? "Aktif" : "Nonaktif"}
        </BadgeStatus>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Terakhir Diubah",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {format(new Date(row.getValue("updatedAt")), "dd MMM yyyy HH:mm", { locale: id })}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const content = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Buka menu</span>
                <MoreHorizontal className="h-4 w-4" />
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
        )
      },
    },
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rowWrapper = (row: any, children: React.ReactNode) => (
    <ContextMenu key={row.id}>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => handleViewDetail(row.original)}>
          <Eye className="mr-2 h-4 w-4" />
          Lihat Detail
        </ContextMenuItem>
        <ContextMenuItem onClick={() => router.push(`/admin/page-content/edit/${row.original.id}`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleDelete(row.original.id)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Cari konten halaman..."
        searchColumn="title"
        rowWrapper={rowWrapper}
      />

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="!max-w-4xl max-h-[80vh] overflow-y-auto">
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