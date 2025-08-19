"use client"

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

// Debug Modal Component

interface ImageUploadProps {
    onImageUpload: (url: string) => void;
    onImageRemove?: () => void;
    currentImage?: string;
    label?: string;
    accept?: string;
    maxSizeMB?: number;
    className?: string;
    disabled?: boolean;
    url?: string;
}

export function ImageUpload({
    onImageUpload,
    onImageRemove,
    currentImage,
    label = "Upload Gambar",
    accept = "image/*",
    maxSizeMB = 5,
    className = "",
    url = "/api/admin/media/upload/single",
    disabled = false
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [isDragOver, setIsDragOver] = useState(false);


    const handleFileUpload = useCallback(async (file: File) => {
        if (!file) return;

        // Validasi ukuran
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            toast.error(`Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB`);
            return;
        }

        // Validasi tipe
        if (!file.type.startsWith('image/')) {
            toast.error('File harus berupa gambar');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('category', "gallery");
            formData.append('file', file);

            const response = await fetch(url ?? "/api/admin/media/upload/single", {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            // Periksa Content-Type
            const contentType = response.headers.get('content-type');

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Server error (${response.status}):`, errorText);
                toast.error(`Upload gagal: ${response.status} ${response.statusText}`);
                return;
            }

            // Pastikan response adalah JSON
            if (!contentType?.includes('application/json')) {
                const responseText = await response.text();

                // Kumpulkan headers untuk debug
                const headers: Record<string, string> = {};
                response.headers.forEach((value, key) => {
                    headers[key] = value;
                });

                // // Set debug data
                // setDebugData({
                //     status: response.status,
                //     headers,
                //     body: responseText,
                //     url: response.url
                // });
                // setShowDebug(true);

                console.error('Expected JSON but got:', contentType, responseText);
                toast.error('Server mengembalikan HTML, check debug modal untuk detail');
                return;
            }

            const result = await response.json();

            if (result.success) {
                setPreview(result.url);
                onImageUpload(result.url);
                toast.success('Gambar berhasil diupload');
            } else {
                console.error('Upload result error:', result);
                toast.error(result.error || 'Gagal mengupload gambar');
            }

        } catch (error) {
            console.error('Upload error:', error);

            // Error handling yang lebih spesifik
            if (error instanceof TypeError && error.message.includes('fetch')) {
                toast.error('Koneksi ke server gagal');
            } else {
                toast.error('Terjadi kesalahan saat mengupload');
            }
        } finally {
            setIsUploading(false);
        }
    }, [maxSizeMB, onImageUpload, url]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);

        const file = event.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);
    };

    const removeImage = () => {
        setPreview(null);
        onImageUpload('');

        if (onImageRemove) {
            onImageRemove();
        }
    };

    return (
        <>
            <div className={`space-y-2 ${className}`}>
                {label && (
                    <Label className="text-sm font-medium">{label}</Label>
                )}

                <Card className={`overflow-hidden transition-colors ${isDragOver ? 'border-primary bg-primary/5' : 'border-border'
                    }`}>
                    <CardContent className="p-4">
                        {preview ? (
                            <div className="relative group">
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={removeImage}
                                        disabled={disabled || isUploading}
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Hapus
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver
                                    ? 'border-primary bg-primary/5'
                                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                                    }`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <div className="rounded-full bg-muted p-4">
                                        {isUploading ? (
                                            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">
                                            {isUploading ? 'Mengupload...' : 'Pilih gambar atau drag & drop'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            PNG, JPG, WebP, GIF (max {maxSizeMB}MB)
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={disabled || isUploading}
                                            onClick={() => document.getElementById('image-upload')?.click()}
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            {isUploading ? 'Uploading...' : 'Pilih File'}
                                        </Button>
                                    </div>

                                    <Input
                                        id="image-upload"
                                        type="file"
                                        accept={accept}
                                        onChange={handleFileSelect}
                                        disabled={disabled || isUploading}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}