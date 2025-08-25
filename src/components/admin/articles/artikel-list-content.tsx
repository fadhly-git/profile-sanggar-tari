"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/molecules/data-table'
import { createColumns, Article } from '@/components/admin/articles/artikel-columns'
import { ArtikelDetailModal } from '@/components/admin/articles/artikel-detail-modal'
import { DeleteArtikelModal } from '@/components/admin/articles/delete-artikel-modal'
import { MobileCard } from '@/components/admin/articles/mobile-card'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { createExcerpt } from '@/lib/utils'
import { Edit, Eye, Plus, Trash2 } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'

interface ArtikelListContentProps {
    articles: Article[]
    onDeleteArticle: (id: string) => Promise<{ success: boolean; error?: string }>
}

export function ArtikelListContent({ articles: initialArticles, onDeleteArticle }: ArtikelListContentProps) {
    const router = useRouter()
    const isMobile = useIsMobile()
    const [articles, setArticles] = useState(initialArticles)
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [articleToDelete, setArticleToDelete] = useState<{ id: string; title: string } | null>(null)

    const handleView = (id: string) => {
        const article = articles.find(a => a.id === id)
        if (article) {
            setSelectedArticle(article)
            setShowDetailModal(true)
        }
    }

    const handleEdit = (id: string) => {
        router.push(`/admin/articles/edit/${id}`)
    }

    const handleDelete = (id: string) => {
        const article = articles.find(a => a.id === id)
        if (article) {
            setArticleToDelete({ id, title: article.title })
            setShowDeleteModal(true)
        }
    }

    const handleDeleteSuccess = () => {
        if (articleToDelete) {
            setArticles(prev => prev.filter(a => a.id !== articleToDelete.id))
            setArticleToDelete(null)
        }
    }

    const columns = createColumns({ onView: handleView, onEdit: handleEdit, onDelete: handleDelete })
    const articlesData = articles.map(article => ({
        ...article,
        title: createExcerpt(article.title || '', 50),
        excerpt: createExcerpt(article.content || '', 50)
    }))

    // Mobile view
    if (isMobile) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Artikel</h1>
                        <p className="text-muted-foreground">
                            Kelola artikel dan konten website
                        </p>
                    </div>
                    <Button onClick={() => router.push('/admin/articles/create')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Buat
                    </Button>
                </div>

                <div className="grid gap-4">
                    {articles.map((article) => (
                        <MobileCard
                            key={article.id}
                            article={article}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

                {/* Modals */}
                <ArtikelDetailModal
                    article={selectedArticle}
                    open={showDetailModal}
                    onOpenChange={setShowDetailModal}
                />

                <DeleteArtikelModal
                    articleId={articleToDelete?.id || null}
                    articleTitle={articleToDelete?.title || ''}
                    open={showDeleteModal}
                    onOpenChange={setShowDeleteModal}
                    onSuccess={handleDeleteSuccess}
                    onDelete={onDeleteArticle}
                />
            </div>
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowWrapper = (row: any, children: React.ReactNode) => {
        return (
            <ContextMenu key={row.id}>
                <ContextMenuTrigger asChild>
                    {children}
                </ContextMenuTrigger>
                <ContextMenuContent className="w-48">
                    <ContextMenuItem onClick={() => handleView(row.original.id)} className="cursor-pointer">
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Detail
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleEdit(row.original.id)} className="cursor-pointer">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => handleDelete(row.original.id)}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        )
    }

    // Desktop view
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Artikel</h1>
                    <p className="text-muted-foreground">
                        Kelola artikel dan konten website
                    </p>
                </div>
                <Button onClick={() => router.push('/admin/articles/create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Artikel
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={articlesData}
                searchPlaceholder="Cari artikel..."
                searchColumn="title"
                rowWrapper={rowWrapper}
            />

            {/* Modals */}
            <ArtikelDetailModal
                article={selectedArticle}
                open={showDetailModal}
                onOpenChange={setShowDetailModal}
            />

            <DeleteArtikelModal
                articleId={articleToDelete?.id || null}
                articleTitle={articleToDelete?.title || ''}
                open={showDeleteModal}
                onOpenChange={setShowDeleteModal}
                onSuccess={handleDeleteSuccess}
                onDelete={onDeleteArticle}
            />
        </div>
    )
}