// @/components/molecules/gallery-lightbox.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import Image from "next/image";
import { MediaType } from "@prisma/client";

interface GalleryItem {
    id: string;
    title: string;
    description?: string | null;
    imageUrl: string;
    type: MediaType;
    category?: {
        title: string;
        slug: string;
    } | null;
}

interface GalleryLightboxProps {
    items: GalleryItem[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export function GalleryLightbox({ items, initialIndex, isOpen, onClose }: GalleryLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    const currentItem = items[currentIndex];
    const canGoPrevious = currentIndex > 0;
    const canGoNext = currentIndex < items.length - 1;

    const goToPrevious = useCallback(() => {
        if (canGoPrevious) {
            setCurrentIndex(currentIndex - 1);
        }
    }, [canGoPrevious, currentIndex]);

    const goToNext = useCallback(() => {
        if (canGoNext) {
            setCurrentIndex(currentIndex + 1);
        }
    }, [canGoNext, currentIndex]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowLeft':
                goToPrevious();
                break;
            case 'ArrowRight':
                goToNext();
                break;
            case 'Escape':
                onClose();
                break;
        }
    }, [isOpen, goToPrevious, goToNext, onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleDownload = () => {
        if (!currentItem) return;

        const link = document.createElement('a');
        link.href = currentItem.imageUrl;
        link.download = `${currentItem.title.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!currentItem) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogHeader>
                <DialogTitle className="sr-only">Galeri Lightbox</DialogTitle>
            </DialogHeader>
            <DialogContent className="!max-w-3xl max-h-[95vh] p-0 overflow-hidden mx-auto">
                <div className="relative flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-background border-b">
                        <div className="flex items-center gap-3">
                            <div>
                                <h2 className="font-semibold text-lg">{currentItem.title}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    {currentItem.category && (
                                        <Badge variant="secondary" className="text-xs">
                                            {currentItem.category.title}
                                        </Badge>
                                    )}
                                    <span className="text-sm text-muted-foreground">
                                        {currentIndex + 1} dari {items.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Container */}
                    <div className="flex-1 relative bg-black/50 flex items-center justify-center group">
                        <div className="relative max-w-full max-h-full">
                            <Image
                                src={currentItem.imageUrl}
                                alt={currentItem.title}
                                width={400}
                                height={400}
                                className="max-w-full max-h-[60vh] object-contain"
                                priority
                                onClick={handleDownload}
                            />
                        </div>

                        {/* Download Button - Center with hover effect */}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleDownload}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                            <Download className="h-4 w-4 mr-1" />
                            Unduh
                        </Button>

                        {/* Navigation Arrows */}
                        {canGoPrevious && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                                onClick={goToPrevious}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        )}

                        {canGoNext && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                                onClick={goToNext}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
                <DialogDescription>
                    {/* Footer with Description */}
                    {currentItem.description && (
                        <div className="p-4 bg-background border-t">
                            <p className="text-muted-foreground">
                                {currentItem.description}
                            </p>
                        </div>
                    )}

                    {/* Thumbnail Navigation */}
                    <div className="p-4 bg-background border-t">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {items.map((item, index) => (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`relative flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${index === currentIndex ? 'border-primary' : 'border-transparent'
                                        }`}
                                >
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        sizes="4rem"
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
}