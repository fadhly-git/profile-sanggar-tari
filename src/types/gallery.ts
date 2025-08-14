// @/types/gallery.ts
export interface GalleryItem {
  id: string
  title: string
  description: string | null
  imageUrl: string
  type: 'IMAGE' | 'VIDEO'
  category: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  authorId: string
  author: {
    id: string
    name: string
    email: string
  }
}

export interface CreateGalleryItem {
  title: string
  description?: string | null
  imageUrl: string
  type: 'IMAGE' | 'VIDEO'
  category?: string | null
  isActive: boolean
  authorId: string
}

export interface UpdateGalleryItem extends Partial<CreateGalleryItem> {
  id: string
}