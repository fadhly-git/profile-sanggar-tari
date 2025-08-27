// @/lib/actions/gallery-actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { CreateGalleryItem, UpdateGalleryItem } from '@/types/gallery'
import { MediaType } from '@prisma/client'

// Types
interface GalleryCategory {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  items: GalleryItem[];
  _count: {
    items: number;
  };
}

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  type: MediaType;
  order: number;
  isActive: boolean;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    title: string;
    slug: string;
  } | null;
}

interface PaginatedGalleryResult {
  category: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
  };
  items: {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    type: MediaType;
    order: number;
    isActive: boolean;
    categoryId: string | null;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    category: {
      title: string;
      slug: string;
    } | null;
  }[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

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
        category: {
          include: {
            items: true,
            _count: true,
          },
        },
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

export async function getGalleryCategories() {
  try {
    const categories = await prisma.galleryCategory.findMany({
      where: { isActive: true },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          take: 1, // Ambil 1 item untuk thumbnail kategori
          select: {
            id: true,
            imageUrl: true,
            title: true,
          },
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
    return { success: false, error: "Gagal mengambil kategori galeri", data: null };
  }
}

export async function getGalleryItemsByCategory(
  categorySlug: string,
  page: number = 1,
  limit: number = 12
): Promise<{ success: boolean; data?: PaginatedGalleryResult; error?: string }> {
  try {
    const skip = (page - 1) * limit;

    // Get category info
    const category = await prisma.galleryCategory.findUnique({
      where: {
        slug: categorySlug,
        isActive: true
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
      },
    });

    if (!category) {
      return { success: false, error: "Kategori tidak ditemukan" };
    }

    // Get items and total count
    const [items, totalCount] = await Promise.all([
      prisma.galleryItem.findMany({
        where: {
          categoryId: category.id,
          isActive: true
        },
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" }
        ],
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          type: true,
          order: true,
          isActive: true,
          categoryId: true,
          authorId: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      }),
      prisma.galleryItem.count({
        where: {
          categoryId: category.id,
          isActive: true
        }
      })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      data: {
        category,
        items,
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return { success: false, error: "Gagal mengambil item galeri" };
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
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" }
      ],
      ...(limit && { take: limit }),
    });

    return { success: true, data: items };
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return { success: false, error: "Gagal mengambil item galeri", data: null };
  }
}

export async function getFeaturedGalleryItems(limit: number = 6) {
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
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" }
      ],
      take: limit,
    });

    return { success: true, data: items };
  } catch (error) {
    console.error("Error fetching featured gallery items:", error);
    return { success: false, error: "Gagal mengambil item galeri unggulan", data: null };
  }
}

// Function untuk search gallery items
export async function searchGalleryItems(
  query: string,
  page: number = 1,
  limit: number = 12,
  categorySlug?: string
) {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      isActive: true,
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: query,
            mode: "insensitive"
          }
        }
      ]
    };

    // Add category filter if specified
    if (categorySlug) {
      const category = await prisma.galleryCategory.findUnique({
        where: { slug: categorySlug, isActive: true },
        select: { id: true }
      });

      if (category) {
        where.categoryId = category.id;
      }
    }

    // Get items and total count
    const [items, totalCount] = await Promise.all([
      prisma.galleryItem.findMany({
        where,
        include: {
          category: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" }
        ],
        skip,
        take: limit,
      }),
      prisma.galleryItem.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      data: {
        items,
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    console.error("Error searching gallery items:", error);
    return { success: false, error: "Gagal mencari item galeri" };
  }
}