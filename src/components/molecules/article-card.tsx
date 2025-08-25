// @/components/molecules/article-card.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Image from 'next/image'

interface ArticleCardProps {
    id: string
    title: string
    slug: string
    excerpt?: string
    featuredImage?: string
    publishedAt: Date
    author: {
        name: string
    }
}

export default function ArticleCard({
    title,
    slug,
    excerpt,
    featuredImage,
    publishedAt,
    author
}: ArticleCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/artikel/${slug}`}>
                {featuredImage && (
                    <div className="aspect-video overflow-hidden">
                        <Image
                            width={600}
                            height={400}
                            src={featuredImage}
                            alt={title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}
                <CardHeader className="space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{format(publishedAt, 'dd MMMM yyyy', { locale: id })}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{author.name}</span>
                        </div>
                    </div>
                </CardHeader>
                {excerpt && (
                    <CardContent>
                        <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
                    </CardContent>
                )}
            </Link>
        </Card>
    )
}