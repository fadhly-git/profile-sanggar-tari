// @/components/molecules/gallery-category-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface GalleryCategoryCardProps {
    category: {
        id: string;
        title: string;
        slug: string;
        description?: string;
        items: Array<{
            id: string;
            imageUrl: string;
            title: string;
        }>;
        _count: {
            items: number;
        };
    };
    className?: string;
}

export function GalleryCategoryCard({ category, className = "" }: GalleryCategoryCardProps) {
    const thumbnailImage = category.items[0]?.imageUrl || "/logo.png";

    return (
        <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 group ${className}`}>
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={thumbnailImage}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Item Count Badge */}
                <div className="absolute top-4 right-4">
                    <Badge className="bg-black/50 text-white backdrop-blur-sm">
                        <ImageIcon className="h-3 w-3 mr-1" />
                        {category._count.items} foto
                    </Badge>
                </div>

                {/* Category Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{category.title}</h3>
                    {category.description && (
                        <p className="text-white/80 text-sm line-clamp-2">
                            {category.description}
                        </p>
                    )}
                </div>
            </div>

            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        {category._count.items} foto tersedia
                    </div>
                    <Link href={`/galeri/${category.slug}`}>
                        <Button variant="ghost" size="sm" className="group/btn">
                            Lihat Semua
                            <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}