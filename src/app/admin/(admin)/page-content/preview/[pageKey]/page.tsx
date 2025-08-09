// @/app/admin/page-content/preview/[pageKey]/page.tsx

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RichTextViewer } from '@/components/editor/rich-text-viewer';
import { MetadataViewer } from '@/components/editor/metadata-viewer';
import { getPageContentByKey } from '@/lib/page-content/actions';
import { formatDate } from '@/lib/utils';

interface PreviewPageProps {
    params: Promise<{ pageKey: string }>
}

const PAGE_KEY_LABELS: Record<string, string> = {
    about_us: 'Tentang Kami',
    vision_mission: 'Visi & Misi',
    history: 'Sejarah',
    contact_info: 'Informasi Kontak',
    // Tambahkan mapping lainnya sesuai kebutuhan
};

export default async function PreviewPage({ params }: PreviewPageProps) {
    const resolvedParams = await params;
    const { pageKey } = resolvedParams;
    // Try to get preview data from sessionStorage
    let pageContent: {
        id?: string;
        pageKey: string;
        title: string;
        content: string;
        metadata?: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    } | null = null;

    if (typeof window !== 'undefined') {
        const previewData = sessionStorage.getItem('pageContentPreview');
        if (previewData) {
            const parsedData = JSON.parse(previewData);
            if (parsedData.pageKey === pageKey) {
                pageContent = parsedData;
            }
        }
    }

    // Fallback to database if no preview data in sessionStorage
    if (!pageContent) {
        const dbContent = await getPageContentByKey(pageKey);
        if (!dbContent) {
            notFound();
        }
        pageContent = {
            ...dbContent,
            metadata: dbContent.metadata ?? undefined,
            createdAt: typeof dbContent.createdAt === 'string' ? dbContent.createdAt : dbContent.createdAt.toISOString(),
            updatedAt: typeof dbContent.updatedAt === 'string' ? dbContent.updatedAt : dbContent.updatedAt.toISOString(),
        };
    }

    const pageLabel = PAGE_KEY_LABELS[pageKey] || pageKey.replace(/_/g, ' ');

    return (
        <div className="container mx-auto py-6 px-4 max-w-4xl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <Link href="/admin/page-content">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>
                        <div className="h-6 w-px bg-border" />
                        <div className="flex items-center space-x-2">
                            <Eye className="h-5 w-5 text-muted-foreground" />
                            <h1 className="text-2xl font-bold">Preview: {pageLabel}</h1>
                        </div>
                    </div>

                    <Link href={`/admin/page-content/edit/${pageContent.id}`}>
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </Link>
                </div>

                {/* Status dan Info */}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                        <Badge variant={pageContent.isActive ? 'default' : 'secondary'}>
                            {pageContent.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Dibuat: {formatDate(pageContent.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Diperbarui: {formatDate(pageContent.updatedAt)}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Konten Utama */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>{pageContent.title}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RichTextViewer
                                content={pageContent.content}
                                className="min-h-[200px]"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Metadata */}
                <div className="space-y-6">
                    {/* Info Halaman */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Informasi Halaman</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Page Key
                                </label>
                                <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                    {pageContent.pageKey}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    ID
                                </label>
                                <p className="text-xs font-mono text-muted-foreground">
                                    {pageContent.id}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Status
                                </label>
                                <div className="mt-1">
                                    <Badge variant={pageContent.isActive ? 'default' : 'secondary'}>
                                        {pageContent.isActive ? 'Aktif' : 'Tidak Aktif'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    {pageContent.metadata && (
                        <MetadataViewer metadata={pageContent.metadata} />
                    )}
                </div>
            </div>
        </div>
    );
}