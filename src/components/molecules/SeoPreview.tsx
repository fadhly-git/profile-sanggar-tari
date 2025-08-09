import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SeoPreviewProps {
    title: string;
    slug: string;
    content: string;
    baseUrl?: string;
}

export function SeoPreview({ 
    title, 
    slug, 
    content, 
    baseUrl = "example.com" 
}: SeoPreviewProps) {
    const description = content
        ? content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
        : "Deskripsi berita akan muncul di sini...";

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pratinjau SEO</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="text-sm font-medium text-blue-600 hover:underline cursor-pointer break-words">
                        {title || "Judul Berita Anda"}
                    </div>
                    <div className="text-xs text-green-600 break-all">
                        {baseUrl}/berita/{slug || "url-berita"}
                    </div>
                    <div className="text-xs text-gray-600 break-words">
                        {description}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}