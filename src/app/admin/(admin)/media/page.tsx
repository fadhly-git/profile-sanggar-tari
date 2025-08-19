// app/admin/media/page.tsx
"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import {
    ArrowLeft,
    Search,
    Upload,
    Trash2,
    Eye,
    Download,
    Copy,
    Grid3x3,
    List,
    Filter,
    SortAsc,
    SortDesc,
    Loader2,
    Image as ImageIcon,
    FolderOpen,
    Calendar,
    HardDrive,
    RefreshCw,
    Plus,
    X,
    CheckCircle,
    AlertCircle,
    FileImage,
    CloudUpload
} from 'lucide-react'
import Image from 'next/image'

interface MediaFile {
    name: string
    path: string
    url: string
    size: number
    type: string
    lastModified: string
    category: string
}

interface MediaResponse {
    files: MediaFile[]
    categories: string[]
    total: number
}

interface UploadFile {
    file: File
    id: string
    status: 'pending' | 'uploading' | 'success' | 'error'
    progress: number
    error?: string
    url?: string
}

export default function MediaLibraryPage() {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [files, setFiles] = useState<MediaFile[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [fileToDelete, setFileToDelete] = useState<MediaFile | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Upload states
    const [showUploadDialog, setShowUploadDialog] = useState(false)
    const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
    const [uploadCategory, setUploadCategory] = useState('other')
    const [isUploading, setIsUploading] = useState(false)
    const [isDragOver, setIsDragOver] = useState(false)

    // Filters
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('all')
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    // State untuk custom category
    const [customCategory, setCustomCategory] = useState('')
    const [showCustomCategory, setShowCustomCategory] = useState(false)

    // Predefined categories
    const predefinedCategories = [
        { value: 'hero-section', label: 'Hero Section' },
        { value: 'berita', label: 'Berita' },
        { value: 'profile', label: 'Profile' },
        { value: 'gallery', label: 'Gallery' },
        { value: 'layanan', label: 'Layanan' },
        { value: 'other', label: 'Other' },
        { value: 'custom', label: 'Custom Category...' }
    ]

    // Load media files
    const loadFiles = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                category,
                search,
                sort: sortBy,
                order: sortOrder
            })

            const response = await fetch(`/api/admin/media?${params}`)
            const data: MediaResponse = await response.json()

            if (response.ok) {
                setFiles(data.files)
                setCategories(data.categories)
            } else {
                toast.error('Gagal memuat media files')
            }
        } catch (error) {
            console.error('Error loading files:', error)
            toast.error('Terjadi kesalahan saat memuat files')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadFiles()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, search, sortBy, sortOrder])

    // Handle file selection
    const handleFileSelect = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return

        const newFiles: UploadFile[] = Array.from(selectedFiles).map(file => ({
            file,
            id: Math.random().toString(36).substring(2, 9),
            status: 'pending',
            progress: 0
        }))

        setUploadFiles(prev => [...prev, ...newFiles])
    }

    // Handle drag and drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)

        const droppedFiles = e.dataTransfer.files
        handleFileSelect(droppedFiles)
    }

    // Remove file from upload queue
    const removeUploadFile = (id: string) => {
        setUploadFiles(prev => prev.filter(f => f.id !== id))
    }

    // Clear all upload files
    const clearUploadFiles = () => {
        setUploadFiles([])
    }

    // Upload files
    const uploadFilesToServer = async () => {
        if (uploadFiles.length === 0) return

        setIsUploading(true)

        try {
            const formData = new FormData()

            // Add files to FormData
            uploadFiles.forEach(uploadFile => {
                formData.append('files', uploadFile.file)
            })

            // Add category
            formData.append('category', uploadCategory)

            // Add custom category if selected
            if (uploadCategory === 'custom' && customCategory.trim()) {
                formData.append('customCategory', customCategory.trim())
            }

            // Update status to uploading
            setUploadFiles(prev => prev.map(f => ({ ...f, status: 'uploading' as const })))

            const response = await fetch('/api/admin/media/upload', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            })

            const result = await response.json()

            if (result.success) {
                // Update successful files
                setUploadFiles(prev => prev.map(f => ({
                    ...f,
                    status: 'success',
                    progress: 100
                })))

                toast.success(result.message)

                // Refresh file list
                await loadFiles()

                // Close dialog after delay
                setTimeout(() => {
                    setShowUploadDialog(false)
                    clearUploadFiles()
                    setCustomCategory('')
                    setShowCustomCategory(false)
                }, 2000)
            } else {
                // Handle errors
                setUploadFiles(prev => prev.map(f => ({
                    ...f,
                    status: 'error',
                    error: 'Upload failed'
                })))

                toast.error(result.error || 'Upload gagal')
            }

            // Show individual file errors
            if (result.errors && result.errors.length > 0) {
                result.errors.forEach((error: string) => {
                    toast.error(error)
                })
            }

        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Terjadi kesalahan saat mengupload')

            setUploadFiles(prev => prev.map(f => ({
                ...f,
                status: 'error',
                error: 'Network error'
            })))
        } finally {
            setIsUploading(false)
        }
    }

    const handleCategoryChange = (value: string) => {
        setUploadCategory(value)
        if (value === 'custom') {
            setShowCustomCategory(true)
        } else {
            setShowCustomCategory(false)
            setCustomCategory('')
        }
    }

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Copy URL to clipboard
    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url)
        toast.success('URL berhasil disalin ke clipboard')
    }

    // Delete file
    const deleteFile = async (file: MediaFile) => {
        try {
            setIsDeleting(true)
            const response = await fetch(`/api/admin/media?path=${encodeURIComponent(file.path)}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                toast.success('File berhasil dihapus')
                setFiles(files.filter(f => f.path !== file.path))
                setDeleteDialogOpen(false)
                setFileToDelete(null)
            } else {
                toast.error('Gagal menghapus file')
            }
        } catch (error) {
            console.error('Error deleting file:', error)
            toast.error('Terjadi kesalahan saat menghapus file')
        } finally {
            setIsDeleting(false)
        }
    }

    // Download file
    const downloadFile = (file: MediaFile) => {
        const link = document.createElement('a')
        link.href = file.url
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Get category color
    const getCategoryColor = (category: string) => {
        const colors = {
            'hero-section': 'bg-blue-100 text-blue-800',
            'berita': 'bg-green-100 text-green-800',
            'profile': 'bg-purple-100 text-purple-800',
            'gallery': 'bg-yellow-100 text-yellow-800',
            'other': 'bg-gray-100 text-gray-800'
        }
        return colors[category as keyof typeof colors] || colors.other
    }

    return (
        <div className="container max-w-7xl py-8">
            {/* Header */}
            <div className="mb-8">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                            <FolderOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Media Library</h1>
                            <p className="text-muted-foreground">
                                Kelola semua file media yang diupload ke sistem
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={loadFiles}
                            disabled={loading}
                        >
                            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button
                            onClick={() => setShowUploadDialog(true)}
                            size={"sm"}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Media
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Files</p>
                                    <p className="text-2xl font-bold">{files.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2">
                                <FolderOpen className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Categories</p>
                                    <p className="text-2xl font-bold">{categories.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2">
                                <HardDrive className="h-5 w-5 text-purple-500" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                                    <p className="text-2xl font-bold">
                                        {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-orange-500" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Last Upload</p>
                                    <p className="text-2xl font-bold">
                                        {files.length > 0 ? 'Today' : 'Never'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filter & Search
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Search */}
                            <div className="space-y-2">
                                <Label htmlFor="search">Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Cari file..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kategori</SelectItem>
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sort By */}
                            <div className="space-y-2">
                                <Label>Sort By</Label>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date">Date</SelectItem>
                                        <SelectItem value="name">Name</SelectItem>
                                        <SelectItem value="size">Size</SelectItem>
                                        <SelectItem value="type">Type</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sort Order */}
                            <div className="space-y-2">
                                <Label>Order</Label>
                                <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="desc">
                                            <div className="flex items-center gap-2">
                                                <SortDesc className="h-4 w-4" />
                                                Descending
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="asc">
                                            <div className="flex items-center gap-2">
                                                <SortAsc className="h-4 w-4" />
                                                Ascending
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* View Mode */}
                            <div className="space-y-2">
                                <Label>View Mode</Label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <Grid3x3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : files.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">Tidak ada file ditemukan</h3>
                            <p className="text-muted-foreground mb-4">
                                {search || category !== 'all'
                                    ? 'Coba ubah filter atau kata kunci pencarian'
                                    : 'Belum ada file yang diupload'
                                }
                            </p>
                            <div className="flex gap-2 justify-center">
                                <Button onClick={() => {
                                    setSearch('')
                                    setCategory('all')
                                }}>
                                    Reset Filter
                                </Button>
                                <Button onClick={() => setShowUploadDialog(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Upload Media
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : 'space-y-2'}>
                    {files.map((file) => (
                        <Card key={file.path} className={viewMode === 'grid' ? 'group hover:shadow-md transition-shadow' : ''}>
                            {viewMode === 'grid' ? (
                                <CardContent className="p-4">
                                    <div className="aspect-square relative mb-3 rounded-lg overflow-hidden bg-muted">
                                        <Image
                                            src={file.url}
                                            alt={file.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            onError={(e) => {
                                                console.error('Image load error:', {
                                                    src: file.url,
                                                    fileName: file.name,
                                                    error: e
                                                })
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => setSelectedFile(file)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => copyToClipboard(file.url)}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        setFileToDelete(file)
                                                        setDeleteDialogOpen(true)
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className={getCategoryColor(file.category)}>
                                                {file.category}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {file.type.toUpperCase()}
                                            </Badge>
                                        </div>

                                        <h3 className="font-medium text-sm truncate" title={file.name}>
                                            {file.name}
                                        </h3>

                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{formatFileSize(file.size)}</span>
                                            <span>{formatDate(file.lastModified)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            ) : (
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                            <Image
                                                src={file.url}
                                                alt={file.name}
                                                fill
                                                className="object-cover"
                                                sizes="48px"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-medium truncate">{file.name}</h3>
                                                <Badge variant="secondary" className={getCategoryColor(file.category)}>
                                                    {file.category}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {file.type.toUpperCase()}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span>{formatFileSize(file.size)}</span>
                                                <span>{formatDate(file.lastModified)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setSelectedFile(file)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => copyToClipboard(file.url)}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => downloadFile(file)}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    setFileToDelete(file)
                                                    setDeleteDialogOpen(true)
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {/* Upload Dialog */}
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CloudUpload className="h-5 w-5" />
                            Upload Media Files
                        </DialogTitle>
                        <DialogDescription>
                            Upload gambar ke media library. Pilih kategori dan drag & drop atau pilih file dari komputer.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Category Selection */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Kategori Upload</Label>
                                <Select value={uploadCategory} onValueChange={handleCategoryChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {predefinedCategories.map(cat => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Custom Category Input */}
                            {showCustomCategory && (
                                <div className="space-y-2">
                                    <Label htmlFor="customCategory">Nama Kategori Baru</Label>
                                    <Input
                                        id="customCategory"
                                        placeholder="Masukkan nama kategori (contoh: produk, staff, banner)"
                                        value={customCategory}
                                        onChange={(e) => setCustomCategory(e.target.value)}
                                        className="w-full"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Kategori baru akan dibuat otomatis. Gunakan nama yang deskriptif.
                                    </p>
                                </div>
                            )}

                            <p className="text-xs text-muted-foreground">
                                File akan diorganisir berdasarkan kategori di folder{' '}
                                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                                    /uploads/images/{showCustomCategory && customCategory ? customCategory : uploadCategory}/
                                </code>
                            </p>
                        </div>

                        {/* Upload Area */}
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver
                                ? 'border-primary bg-primary/5'
                                : uploadFiles.length > 0
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                                }`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <div className="space-y-4">
                                <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium">
                                        {uploadFiles.length > 0 ? 'File siap diupload' : 'Drag & drop gambar di sini'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        atau{' '}
                                        <Button
                                            type="button"
                                            variant="link"
                                            className="p-0 h-auto font-medium text-primary"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            pilih file dari komputer
                                        </Button>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        PNG, JPG, WebP, GIF hingga 5MB per file. Multiple upload didukung.
                                    </p>
                                </div>

                                {uploadFiles.length > 0 && (
                                    <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                                        <CheckCircle className="h-4 w-4" />
                                        {uploadFiles.length} file dipilih
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleFileSelect(e.target.files)}
                            className="hidden"
                        />

                        {/* File List */}
                        {uploadFiles.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">File Queue ({uploadFiles.length})</h3>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearUploadFiles}
                                        disabled={isUploading}
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Clear All
                                    </Button>
                                </div>

                                <div className="max-h-64 overflow-y-auto space-y-2">
                                    {uploadFiles.map((uploadFile) => (
                                        <div
                                            key={uploadFile.id}
                                            className="flex items-center gap-4 p-3 border rounded-lg bg-muted/30"
                                        >
                                            {/* File Icon/Preview */}
                                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                                <FileImage className="h-5 w-5 text-muted-foreground" />
                                            </div>

                                            {/* File Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-sm font-medium truncate">
                                                        {uploadFile.file.name}
                                                    </p>
                                                    <Badge
                                                        variant={
                                                            uploadFile.status === 'success'
                                                                ? 'default'
                                                                : uploadFile.status === 'error'
                                                                    ? 'destructive'
                                                                    : uploadFile.status === 'uploading'
                                                                        ? 'secondary'
                                                                        : 'outline'
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {uploadFile.status === 'pending' && 'Pending'}
                                                        {uploadFile.status === 'uploading' && 'Uploading...'}
                                                        {uploadFile.status === 'success' && 'Success'}
                                                        {uploadFile.status === 'error' && 'Error'}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span>{formatFileSize(uploadFile.file.size)}</span>
                                                    <span>{uploadFile.file.type}</span>
                                                </div>

                                                {/* Preview nama file yang akan disimpan */}
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    <span className="font-medium">Akan disimpan sebagai:</span>{' '}
                                                    <code className="bg-muted px-1 py-0.5 rounded">
                                                        {uploadFile.file.name
                                                            .toLowerCase()
                                                            .replace(/[^a-z0-9.]/g, '-')
                                                            .replace(/-+/g, '-')
                                                            .replace(/^-|-$/g, '')
                                                            .replace(/(\.[^.]+)$/, `-${Date.now()}$1`)
                                                        }
                                                    </code>
                                                </div>

                                                {/* Progress Bar */}
                                                {uploadFile.status === 'uploading' && (
                                                    <Progress value={uploadFile.progress} className="mt-2 h-2" />
                                                )}

                                                {/* Error Message */}
                                                {uploadFile.status === 'error' && uploadFile.error && (
                                                    <p className="text-xs text-red-500 mt-1">{uploadFile.error}</p>
                                                )}

                                                {/* Success URL */}
                                                {uploadFile.status === 'success' && uploadFile.url && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            className="p-0 h-auto text-xs"
                                                            onClick={() => copyToClipboard(uploadFile.url!)}
                                                        >
                                                            Copy URL
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Status Icon & Remove Button */}
                                            <div className="flex items-center gap-2">
                                                {uploadFile.status === 'pending' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeUploadFile(uploadFile.id)}
                                                        disabled={isUploading}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {uploadFile.status === 'uploading' && (
                                                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                                )}
                                                {uploadFile.status === 'success' && (
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                )}
                                                {uploadFile.status === 'error' && (
                                                    <div className="flex gap-1">
                                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeUploadFile(uploadFile.id)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add More Files
                            </Button>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowUploadDialog(false)}
                                disabled={isUploading}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={uploadFilesToServer}
                                disabled={uploadFiles.length === 0 || isUploading}
                                size={'sm'}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload {uploadFiles.length} File{uploadFiles.length > 1 ? 's' : ''}
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* File Detail Dialog */}
            {selectedFile && (
                <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
                    <DialogContent className="!max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Detail File</DialogTitle>
                            <DialogDescription>
                                Informasi lengkap tentang file yang dipilih
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                                    <Image
                                        src={selectedFile.url}
                                        alt={selectedFile.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">Nama File</Label>
                                    <p className="text-sm text-muted-foreground break-all">{selectedFile.name}</p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">URL</Label>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-muted-foreground break-all flex-1">{selectedFile.url}</p>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => copyToClipboard(selectedFile.url)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">Kategori</Label>
                                    <div className="mt-1">
                                        <Badge className={getCategoryColor(selectedFile.category)}>
                                            {selectedFile.category}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium">Ukuran</Label>
                                        <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">Tipe</Label>
                                        <p className="text-sm text-muted-foreground">{selectedFile.type.toUpperCase()}</p>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">Terakhir Dimodifikasi</Label>
                                    <p className="text-sm text-muted-foreground">{formatDate(selectedFile.lastModified)}</p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">Path</Label>
                                    <p className="text-sm text-muted-foreground break-all">{selectedFile.path}</p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => downloadFile(selectedFile)}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.open(selectedFile.url, '_blank')}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Buka di Tab Baru
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    setFileToDelete(selectedFile)
                                    setDeleteDialogOpen(true)
                                    setSelectedFile(null)
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus File
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus File</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus file{' '}
                            <strong>{fileToDelete?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={isDeleting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => fileToDelete && deleteFile(fileToDelete)}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                'Hapus'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}