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
        revalidatePath(`/articles/${article.id}`)
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