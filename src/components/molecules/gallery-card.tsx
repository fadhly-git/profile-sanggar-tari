// @/components/molecules/gallery-card.tsx (Update dengan desain Gallery4)
'use client'

import Image from 'next/image'
import Link from 'next/link'

interface GalleryCardProps {
    title: string
    slug: string
    description?: string
    itemCount: number
    coverImage?: string
}

export default function GalleryCard({
    title,
    slug,
    description,
    itemCount,
    coverImage
}: GalleryCardProps) {
    return (
        <Link href={`/galeri/${slug}`}>
            <div className="group rounded-xl">
                <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9]">
                    {coverImage ? (
                        <Image
                            src={coverImage}
                            alt={title}
                            className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                            width={600}
                            height={400}
                        />
                    ) : (
                        <div className="absolute h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <span className="text-6xl opacity-50">🎭</span>
                        </div>
                    )}
                    <div className="absolute inset-0 h-full bg-[linear-gradient(transparent_20%,var(--secondary)_100%)] mix-blend-multiply" />
                    <div className="text-secondary-foreground absolute inset-x-0 bottom-0 flex flex-col items-start p-6 md:p-8">
                        <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4 hover:text-primary transition-colors">
                            {title}
                        </div>
                        {description && (
                            <div className="mb-4 line-clamp-2 text-sm opacity-90">
                                {description}
                            </div>
                        )}
                        <div className="text-sm opacity-75 bg-primary/20 px-2 py-1 rounded-full">
                            {itemCount} Foto
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}