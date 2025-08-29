/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/actions/article-actions.ts
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ArticleStatus } from "@prisma/client"
import { Article } from "@prisma/client"

export interface CreateArticleData {
  title: string
  slug: string
  excerpt?: string
  content: string
  featuredImage?: string
  status: ArticleStatus
  authorId: string
}

export interface UpdateArticleData extends CreateArticleData {
  id: string
  publishedAt?: Date | null
}

// Create artikel
export async function createArticle(data: CreateArticleData) {
  try {
    const article = await prisma.article.create({
      data: {
        ...data,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
      },
    })

    revalidatePath('/admin/articles')
    revalidatePath(`/artikel/${article.id}`)
    revalidatePath('/artikel')
    return { success: true, data: article }
  } catch (error) {
    console.error('Error creating article:', error)
    return { success: false, error: 'Gagal membuat artikel' }
  }
}

// Update artikel
export async function updateArticle(data: Article) {
  try {
    const existingArticle = await prisma.article.findUnique({
      where: { id: data.id }
    })

    if (!existingArticle) {
      return { success: false, error: 'Artikel tidak ditemukan' }
    }

    const shouldSetPublishedAt =
      data.status === 'PUBLISHED' && existingArticle.status !== 'PUBLISHED'

    const article = await prisma.article.update({
      where: { id: data.id },
      data: {
        ...data,
        publishedAt: shouldSetPublishedAt ? new Date() : existingArticle.publishedAt,
      },
    })

    revalidatePath('/admin/articles')
    revalidatePath(`/articles/${data.id}`)
    revalidatePath('/artikel')
    revalidatePath(`/artikel/${data.slug}`)
    return { success: true, data: article }
  } catch (error) {
    console.error('Error updating article:', error)
    return { success: false, error: 'Gagal mengupdate artikel' }
  }
}

// Delete artikel
export async function deleteArticle(id: string) {
  try {
    await prisma.article.delete({
      where: { id }
    })

    revalidatePath('/admin/articles')
    revalidatePath('/artikel')
    revalidatePath('/', 'layout') // Clears entire layout cache
    return { success: true }
  } catch (error) {
    console.error('Error deleting article:', error)
    return { success: false, error: 'Gagal menghapus artikel' }
  }
}

// Get all articles
export async function getArticles() {
  try {
    const articles = await prisma.article.findMany({
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
        updatedAt: 'desc'
      }
    })

    return articles
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

// Get article by ID
export async function getArticleById(id: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return article
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}


// public article
export interface ArticleWithAuthor extends Article {
  author: {
    name: string;
  };
}

export async function getPublishedArticles(limit?: number): Promise<ArticleWithAuthor[]> {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        publishedAt: {
          lte: new Date(),
        },
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
    });
    // console.log('Fetched Articles:', articles);
    return articles;
  } catch (error) {
    console.error("Error fetching published articles:", error);
    return [];
  }
}

export async function getPublishedArticlesPub(limit?: number): Promise<{ success: boolean; data: ArticleWithAuthor[] } | { success: boolean; error: string }> {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        publishedAt: {
          lte: new Date(),
        },
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
    });
    // console.log('Fetched Articles:', articles);
    return { success: true, data: articles };
  } catch (error) {
    console.error("Error fetching published articles:", error);
    return { success: false, error: "Gagal mengambil artikel yang dipublikasikan" };
  }
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithAuthor | null> {
  try {
    const article = await prisma.article.findUnique({
      where: {
        slug,
        status: ArticleStatus.PUBLISHED,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return article;
  } catch (error) {
    console.error(`Error fetching article by slug ${slug}:`, error);
    return null;
  }
}

export async function getRecentArticles(excludeSlug?: string, limit: number = 3) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        publishedAt: {
          lte: new Date()
        },
        ...(excludeSlug && { slug: { not: excludeSlug } }),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
    });

    return { success: true, data: articles };
  } catch (error) {
    console.error("Error fetching recent articles:", error);
    return { success: false, error: "Gagal mengambil artikel terbaru" };
  }
}

export async function getPublishedArticlesWithPagination(
  page: number = 1,
  limit: number = 9,
  search?: string,
  sortBy: string = "newest"
) {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: ArticleStatus.PUBLISHED,
      publishedAt: {
        lte: new Date()
      }
    };

    // Add search filter
    if (search && search.trim()) {
      const searchTerm = search.trim();
      where.OR = [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          excerpt: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          content: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          author: {
            name: {
              contains: searchTerm,
              mode: "insensitive"
            }
          }
        }
      ];
    }

    // Build order by
    let orderBy: any = {};
    switch (sortBy) {
      case "oldest":
        orderBy = { publishedAt: "asc" };
        break;
      case "title":
        orderBy = { title: "asc" };
        break;
      case "newest":
      default:
        orderBy = { publishedAt: "desc" };
        break;
    }

    // Get articles and total count in parallel
    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.article.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      data: {
        articles,
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      }
    };
  } catch (error) {
    console.error("Error fetching paginated articles:", error);
    return { success: false, error: "Gagal mengambil artikel" };
  }
}