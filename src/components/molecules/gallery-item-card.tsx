// @/components/molecules/gallery-item-card.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZoomIn, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { MediaType } from "@prisma/client";

interface GalleryItemCardProps {
    item: {
        id: string;
        title: string;
        description?: string;
        imageUrl: string;
        type: MediaType;
        category?: {
            title: string;
            slug: string;
        };
    };
    onClick?: () => void;
    className?: string;
}

export function GalleryItemCard({ item, onClick, className = "" }: GalleryItemCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card
            className={`overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className="relative aspect-square overflow-hidden">
                <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Media Type Badge */}
                {item.type === MediaType.VIDEO && (
                    <div className="absolute top-3 left-3">
                        <Badge className="bg-red-500 text-white">
                            <Play className="h-3 w-3 mr-1" />
                            Video
                        </Badge>
                    </div>
                )}

                {/* Category Badge */}
                {item.category && (
                    <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                            {item.category.title}
                        </Badge>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="secondary" className="backdrop-blur-sm">
                            <ZoomIn className="h-4 w-4 mr-1" />
                            Lihat
                        </Button>
                    </div>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-medium line-clamp-1 mb-1">
                        {item.title}
                    </h3>
                    {item.description && (
                        <p className="text-white/70 text-sm line-clamp-2">
                            {item.description}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}