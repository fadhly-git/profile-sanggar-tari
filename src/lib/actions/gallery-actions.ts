// @/lib/actions/gallery-actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { CreateGalleryItem, GalleryCategory, UpdateGalleryItem } from '@/types/gallery'
import { GalleryItem, MediaType } from '@prisma/client'

export async function createGalleryItem(data: CreateGalleryItem) {
    try {
        const galleryItem = await prisma.galleryItem.create({
            data: {
                title: data.title,
                description: data.description,
                imageUrl: data.imageUrl,
                type: data.type as MediaType,
                categoryId: data.categoryId,  // Ubah dari 'category' ke 'categoryId'
                isActive: data.isActive,
                authorId: data.authorId
            },
            include: {
                category: true,  // Include kategori dalam response
                author: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })

        revalidatePath('/admin/gallery/')
        return { success: true, data: galleryItem }
    } catch (error) {
        console.error('Error creating gallery item:', error)
        return { success: false, error: 'Gagal membuat item galeri' }
    }
}

export async function updateGalleryItem(data: UpdateGalleryItem) {
    try {
        const { id } = data
        const item = await prisma.galleryItem.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                imageUrl: data.imageUrl,
                type: data.type,
                categoryId: data.categoryId ?? undefined,  // Ubah dari 'category' ke 'categoryId'
                isActive: data.isActive
            },
            include: {
                category: true,  // Include kategori dalam response
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        revalidatePath('/admin/gallery')
        return { success: true, data: item }
    } catch (error) {
        console.error('Error updating gallery item:', error)
        return { success: false, error: 'Gagal memperbarui item galeri' }
    }
}

export async function deleteGalleryItem(id: string) {
    try {
        await prisma.galleryItem.delete({
            where: { id }
        })

        revalidatePath('/admin/gallery')
        return { success: true }
    } catch (error) {
        console.error('Error deleting gallery item:', error)
        return { success: false, error: 'Gagal menghapus item galeri' }
    }
}

export async function getGalleryItems() {
    try {
        const items = await prisma.galleryItem.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return { success: true, data: items }
    } catch (error) {
        console.error('Error fetching gallery items:', error)
        return { success: false, error: 'Gagal mengambil data galeri' }
    }
}

export async function getGalleryItemById(id: string) {
    try {
        const item = await prisma.galleryItem.findUnique({
            where: { id },
            include: {
                category: true,  // Include kategori dalam response
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        if (!item) {
            return { success: false, error: 'Item galeri tidak ditemukan' }
        }

        return { success: true, data: item }
    } catch (error) {
        console.error('Error fetching gallery item:', error)
        return { success: false, error: 'Gagal mengambil item galeri' }
    }
}

// public gallery
export interface GalleryItemWithCategory extends GalleryItem {
    category: GalleryCategory | null;
}

export async function getActiveGalleryItems(categoryId?: string): Promise<GalleryItemWithCategory[]> {
    try {
        const items = await prisma.galleryItem.findMany({
            where: {
                isActive: true,
                ...(categoryId && { categoryId }),
            },
            include: {
                category: true,
            },
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' },
            ],
        });
        return items;
    } catch (error) {
        console.error("Error fetching gallery items:", error);
        return [];
    }
}

export async function getActiveGalleryCategoriesLimit(limit: number = 6) {
    try {
        const categories = await prisma.galleryCategory.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
            include: {
                items: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' },
                    take: limit // Limit untuk preview
                },
                _count: {
                    select: {
                        items: {
                            where: { isActive: true }
                        }
                    }
                }
            }
        })

        return { success: true, data: categories }
    } catch (error) {
        console.error("Error fetching gallery categories:", error)
        return { success: false, error: "Gagal mengambil kategori galeri" }
    }
}

export async function getGalleryItemsByCategory(categorySlug: string) {
    try {
        const category = await prisma.galleryCategory.findUnique({
            where: {
                slug: categorySlug,
                isActive: true
            },
            include: {
                items: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' }
                }
            }
        })

        if (!category) {
            return { success: false, error: "Kategori tidak ditemukan" }
        }

        return { success: true, data: category }
    } catch (error) {
        console.error("Error fetching gallery items:", error)
        return { success: false, error: "Gagal mengambil item galeri" }
    }
}

export async function getActiveGalleryCategories() {
    try {
        const categories = await prisma.galleryCategory.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
            include: {
                items: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' },
                    take: 1
                },
                _count: {
                    select: {
                        items: {
                            where: { isActive: true }
                        }
                    }
                }
            }
        })

        return { success: true, data: categories }
    } catch (error) {
        console.error("Error fetching gallery categories:", error)
        return { success: false, error: "Gagal mengambil kategori galeri" }
    }
}

export async function getFeaturedGalleryItems(limit: number = 8) {
    try {
        const items = await prisma.galleryItem.findMany({
            where: {
                isActive: true,
                type: 'IMAGE' // Fokus ke gambar untuk carousel
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                category: {
                    select: {
                        title: true,
                        slug: true
                    }
                }
            }
        })

        return { success: true, data: items }
    } catch (error) {
        console.error("Error fetching featured gallery items:", error)
        return { success: false, error: "Gagal mengambil item galeri unggulan" }
    }
}

export async function getGalleryCategories() {
  try {
    const categories = await prisma.galleryCategory.findMany({
      where: { isActive: true },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          take: 1, // Ambil 1 item untuk thumbnail kategori
        },
        _count: {
          select: {
            items: {
              where: { isActive: true }
            }
          }
        }
      },
      orderBy: { order: "asc" },
    });

    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching gallery categories:", error);
    return { success: false, error: "Gagal mengambil kategori galeri" };
  }
}

export async function getAllGalleryItems(limit?: number) {
  try {
    const items = await prisma.galleryItem.findMany({
      where: { isActive: true },
      include: {
        category: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      ...(limit && { take: limit }),
    });

    return { success: true, data: items };
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return { success: false, error: "Gagal mengambil item galeri" };
  }
}