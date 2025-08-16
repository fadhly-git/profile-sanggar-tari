// @/types/gallery.ts

export interface GalleryCategory {
  id: string
  title: string
  slug: string
  description: string | null
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface GalleryItem {
  id: string
  title: string
  description: string | null
  imageUrl: string
  type: 'IMAGE' | 'VIDEO'
  categoryId: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  authorId: string
  author: {
    id: string
    name: string
    email: string
  }

  category?: GalleryCategory | null
}


export interface CreateGalleryItem {
  title: string
  description?: string | null
  imageUrl: string
  type: 'IMAGE' | 'VIDEO'
  categoryId: string | null
  isActive: boolean
  authorId: string
}

export interface UpdateGalleryItem extends Partial<CreateGalleryItem> {
  id: string
}