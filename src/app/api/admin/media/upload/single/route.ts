// app/api/admin/media/upload-single/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File // Single file
        const category = formData.get('category') as string || 'gallery'

        if (!file) {
            return NextResponse.json({ error: 'No file received' }, { status: 400 })
        }

        // Validasi tipe file
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Tipe file tidak didukung' }, { status: 400 })
        }

        // Validasi ukuran file (max 5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'Ukuran file terlalu besar (max 5MB)' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate filename
        const timestamp = Date.now()
        const extension = path.extname(file.name)
        const baseName = path.basename(file.name, extension)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')

        const filename = `${baseName}-${timestamp}${extension}`

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images', category)
        await mkdir(uploadDir, { recursive: true })

        // Save file
        const filePath = path.join(uploadDir, filename)
        await writeFile(filePath, buffer)

        // Verify file exists
        if (!existsSync(filePath)) {
            return NextResponse.json({ error: 'Gagal menyimpan file' }, { status: 500 })
        }

        const fileUrl = `/uploads/images/${category}/${filename}`

        // ✅ Response format yang match dengan component expectations
        return NextResponse.json({
            success: true,
            url: fileUrl, // Simple format yang diharapkan component
            file: {
                originalName: file.name,
                filename,
                url: fileUrl,
                size: file.size,
                type: file.type,
                category
            },
            message: 'File berhasil diupload'
        })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({
            success: false,
            error: 'Gagal mengupload file'
        }, { status: 500 })
    }
}