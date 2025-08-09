// app/api/admin/media/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { readdir, stat, unlink } from 'fs/promises'
import path from 'path'
import { type MediaFile } from '@/types'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category') || 'all'
        const search = searchParams.get('search') || ''
        const sort = searchParams.get('sort') || 'date'
        const order = searchParams.get('order') || 'desc'

        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        const files: MediaFile[] = []

        // Fungsi rekursif untuk membaca semua file
        const readDirectory = async (dir: string) => {
            try {
                const entries = await readdir(dir, { withFileTypes: true })

                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name)
                    const relativePath = path.relative(uploadsDir, fullPath)

                    if (entry.isDirectory()) {
                        await readDirectory(fullPath)
                    } else if (entry.isFile()) {
                        const stats = await stat(fullPath)
                        const ext = path.extname(entry.name).toLowerCase()

                        // Filter hanya file gambar
                        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
                            const fileCategory = path.dirname(relativePath).split(path.sep)[1] || 'other'

                            files.push({
                                name: entry.name,
                                path: relativePath,
                                url: `/uploads/${relativePath.replace(/\\/g, '/')}`,
                                size: stats.size,
                                type: ext.substring(1),
                                lastModified: stats.mtime,
                                category: fileCategory
                            })
                        }
                    }
                }
            } catch (error) {
                console.error('Error reading directory:', dir, error)
            }
        }

        await readDirectory(uploadsDir)

        // Filter berdasarkan kategori
        let filteredFiles = files
        if (category !== 'all') {
            filteredFiles = files.filter(file => file.category === category)
        }

        // Filter berdasarkan pencarian
        if (search) {
            filteredFiles = filteredFiles.filter(file =>
                file.name.toLowerCase().includes(search.toLowerCase())
            )
        }

        // Sort files
        filteredFiles.sort((a, b) => {
            let compareValue = 0

            switch (sort) {
                case 'name':
                    compareValue = a.name.localeCompare(b.name)
                    break
                case 'size':
                    compareValue = a.size - b.size
                    break
                case 'type':
                    compareValue = a.type.localeCompare(b.type)
                    break
                case 'date':
                default:
                    compareValue = a.lastModified.getTime() - b.lastModified.getTime()
                    break
            }

            return order === 'desc' ? -compareValue : compareValue
        })

        // Get categories for filter
        const categories = [...new Set(files.map(file => file.category))]

        return NextResponse.json({
            files: filteredFiles,
            categories,
            total: filteredFiles.length
        })

    } catch (error) {
        console.error('Error fetching media files:', error)
        return NextResponse.json(
            { error: 'Gagal memuat media files' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const filePath = searchParams.get('path')

        if (!filePath) {
            return NextResponse.json(
                { error: 'Path file tidak ditemukan' },
                { status: 400 }
            )
        }

        const fullPath = path.join(process.cwd(), 'public', 'uploads', filePath)
        await unlink(fullPath)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting file:', error)
        return NextResponse.json(
            { error: 'Gagal menghapus file' },
            { status: 500 }
        )
    }
}