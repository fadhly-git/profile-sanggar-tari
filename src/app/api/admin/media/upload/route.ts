// app/api/admin/media/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

// app/api/admin/media/upload/route.ts
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const files = formData.getAll('files') as File[]
        const category = formData.get('category') as string || 'other'
        const customCategory = formData.get('customCategory') as string || ''

        // Gunakan custom category jika ada, jika tidak gunakan category yang dipilih
        const finalCategory = customCategory.trim() || category

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files received' }, { status: 400 })
        }

        const uploadedFiles = []
        const errors = []

        for (const file of files) {
            try {
                // Validasi tipe file
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
                if (!allowedTypes.includes(file.type)) {
                    errors.push(`${file.name}: Tipe file tidak didukung`)
                    continue
                }

                // Validasi ukuran file (max 5MB)
                const maxSize = 5 * 1024 * 1024
                if (file.size > maxSize) {
                    errors.push(`${file.name}: Ukuran file terlalu besar (max 5MB)`)
                    continue
                }

                const bytes = await file.arrayBuffer()
                const buffer = Buffer.from(bytes)

                // Generate filename berdasarkan nama file asli
                const timestamp = Date.now()
                const extension = path.extname(file.name)
                const baseName = path.basename(file.name, extension)
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric dengan dash
                    .replace(/-+/g, '-') // Replace multiple dash dengan single dash
                    .replace(/^-|-$/g, '') // Remove dash di awal/akhir

                const filename = `${baseName}-${timestamp}${extension}`

                // Ensure upload directory exists
                const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images', finalCategory)
                await mkdir(uploadDir, { recursive: true })

                // Save file
                const filePath = path.join(uploadDir, filename)
                await writeFile(filePath, buffer)

                // Verify file exists
                if (!existsSync(filePath)) {
                    errors.push(`${file.name}: Gagal menyimpan file`)
                    continue
                }

                const fileUrl = `/uploads/images/${finalCategory}/${filename}`

                uploadedFiles.push({
                    originalName: file.name,
                    filename,
                    url: fileUrl,
                    size: file.size,
                    type: file.type,
                    category: finalCategory
                })

            } catch (error) {
                console.error(`Error uploading ${file.name}:`, error)
                errors.push(`${file.name}: Gagal mengupload file`)
            }
        }

        return NextResponse.json({
            success: uploadedFiles.length > 0,
            uploadedFiles,
            errors,
            message: `${uploadedFiles.length} file berhasil diupload${errors.length > 0 ? `, ${errors.length} file gagal` : ''}`
        })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({
            error: 'Gagal mengupload file'
        }, { status: 500 })
    }
}