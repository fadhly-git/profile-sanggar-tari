'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { BadgeStatus } from '@/components/atoms/badge-status'
import Image from 'next/image'
import { formatDateTime } from '@/lib/utils'

interface HeroSection {
  id: string
  imageUrl: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface HeroSectionDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  heroSection: HeroSection | null
}

export function HeroSectionDetailModal({
  open,
  onOpenChange,
  heroSection
}: HeroSectionDetailModalProps) {
  if (!heroSection) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Hero Section</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Gambar</label>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
              <Image
                src={heroSection.imageUrl}
                alt="Hero Section"
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div>
                <BadgeStatus status={heroSection.isActive ? 'success' : 'danger'}>
                  {heroSection.isActive ? 'Aktif' : 'Tidak Aktif'}
                </BadgeStatus>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">ID</label>
              <p className="text-sm text-muted-foreground font-mono">
                {heroSection.id}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Dibuat</label>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(heroSection.createdAt)}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Diperbarui</label>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(heroSection.updatedAt)}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">URL Gambar</label>
            <p className="text-sm text-muted-foreground break-all">
              {heroSection.imageUrl}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}