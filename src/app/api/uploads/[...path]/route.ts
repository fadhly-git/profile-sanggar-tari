// app/api/avatars/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { existsSync } from 'fs';
import fs from 'fs';
import { join, extname } from 'path';

// Penentuan mime type secara aman
const mimeMap: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

/** 
 * GET /api/avatars/…/filename.ext 
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const relPath = path.join('/');
  const filePath = join(process.cwd(), 'public', 'uploads', relPath);

  if (!existsSync(filePath)) {
    return NextResponse.json(
      { error: 'File tidak ditemukan', message: `${filePath}` },
      { status: 404 }
    );
  }

  const ext = extname(filePath).toLowerCase();
  const contentType = mimeMap[ext] ?? 'application/octet-stream';

  try {
    const fileContent = fs.readFileSync(filePath);
    // Simply pass the Buffer directly - Next.js handles this correctly
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json(
      { error: 'Gagal membaca file' },
      { status: 500 }
    );
  }
}