"use client";

import { useState } from "react";
import { GalleryItemCard } from "@/components/molecules/gallery-item-card";
import { GalleryLightbox } from "@/components/molecules/gallery-lightbox";
import { MediaType } from "@prisma/client";

interface GalleryItem {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    type: MediaType;
    category?: {
        title: string;
        slug: string;
    };
}

// This matches the actual return type from getFeaturedGalleryItems
interface DatabaseGalleryItem {
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
}

interface GalleryClientWrapperProps {
    items: DatabaseGalleryItem[];
}

export default function GalleryClientWrapper({ items }: GalleryClientWrapperProps) {
    const [lightboxIndex, setLightboxIndex] = useState(-1);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        setLightboxIndex(-1);
    };

    // Transform the data to match GalleryItem interface for the UI components
    const transformedItems: GalleryItem[] = items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || undefined,
        imageUrl: item.imageUrl,
        type: item.type,
        category: item.category ? {
            title: item.category.title,
            slug: item.category.slug,
        } : undefined,
    }));

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {transformedItems.map((item, index) => (
                    <GalleryItemCard
                        key={item.id}
                        item={item}
                        onClick={() => openLightbox(index)}
                    />
                ))}
            </div>

            <GalleryLightbox
                items={transformedItems}
                initialIndex={lightboxIndex}
                isOpen={isLightboxOpen}
                onClose={closeLightbox}
            />
        </>
    );
}