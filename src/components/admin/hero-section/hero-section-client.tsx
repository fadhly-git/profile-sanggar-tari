'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search } from 'lucide-react'
import { DataTable } from '@/components/molecules/data-table'
import { HeroSectionCard } from '@/components/admin/hero-section/hero-section-card'
import { HeroSectionDetailModal } from '@/components/admin/hero-section/hero-section-detail-modal'
import { HeroSectionContextMenu } from '@/components/admin/hero-section/hero-section-context-menu'
import { DeleteConfirmDialog } from '@/components/molecules/delete-confirm-dialog'
import { createColumns } from '@/components/admin/hero-section/hero-section-columns'
import { deleteHeroSection } from '@/lib/actions/hero-section-actions'
import { toast } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile' 

export interface HeroSection {
  id: string
  imageUrl: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface HeroSectionClientProps {
  initialData: HeroSection[]
}

export function HeroSectionClient({ initialData }: HeroSectionClientProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedHeroSection, setSelectedHeroSection] = useState<HeroSection | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter data berdasarkan search query
  const filteredData = initialData.filter(item => 
    item.imageUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.isActive ? 'aktif' : 'tidak aktif').includes(searchQuery.toLowerCase())
  )

  const handleView = (heroSection: HeroSection) => {
    setSelectedHeroSection(heroSection)
    setShowDetailModal(true)
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/hero-sections/${id}/edit`)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    
    setIsDeleting(true)
    try {
      const result = await deleteHeroSection(deleteId)
      
      if (result.success) {
        toast.success('Hero section berhasil dihapus')
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal menghapus hero section')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus hero section',{
        description: (error as Error).message
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
      setDeleteId('')
    }
  }

  const columns = createColumns(handleView, handleEdit, handleDelete)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rowWrapper = (row: any, children: React.ReactNode) => (
    <HeroSectionContextMenu
      heroSection={row.original}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    >
      {children}
    </HeroSectionContextMenu>
  )

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hero Sections</h1>
            <p className="text-muted-foreground">
              Kelola gambar hero section untuk beranda website
            </p>
          </div>
          <Button onClick={() => router.push('/admin/hero-sections/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Baru
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari hero section..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {isMobile ? (
          <div className="grid gap-4">
            {filteredData.map((heroSection) => (
              <HeroSectionCard
                key={heroSection.id}
                heroSection={heroSection}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            {filteredData.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    Tidak ada hero section yang ditemukan
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Daftar Hero Sections ({filteredData.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={filteredData}
                searchPlaceholder="Cari hero section..."
                searchColumn="imageUrl"
                rowWrapper={rowWrapper}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <HeroSectionDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        heroSection={selectedHeroSection}
      />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        loading={isDeleting}
        title="Hapus Hero Section"
        description="Apakah Anda yakin ingin menghapus hero section ini? Tindakan ini tidak dapat dibatalkan."
      />
    </>
  )
}