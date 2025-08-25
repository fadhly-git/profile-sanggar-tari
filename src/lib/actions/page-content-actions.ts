// @/lib/actions/page-content-actions.ts
import { prisma } from "@/lib/prisma"

export async function getPageContentByKey(pageKey: string) {
    try {
        const pageContent = await prisma.pageContent.findUnique({
            where: {
                pageKey,
                isActive: true
            }
        })

        if (!pageContent) {
            return { success: false, error: "Konten halaman tidak ditemukan" }
        }

        // Parse metadata if it's JSON
        let metadata = null
        if (pageContent.metadata) {
            try {
                metadata = JSON.parse(pageContent.metadata)
            } catch (e) {
                console.warn(`Failed to parse metadata for page ${pageKey}`)
                console.error(e)
            }
        }

        return {
            success: true,
            data: {
                ...pageContent,
                metadata
            }
        }
    } catch (error) {
        console.error("Error fetching page content:", error)
        return { success: false, error: "Gagal mengambil konten halaman" }
    }
}

export async function getAllPageContents() {
    try {
        const contents = await prisma.pageContent.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
        })

        return { success: true, data: contents }
    } catch (error) {
        console.error("Error fetching page contents:", error)
        return { success: false, error: "Gagal mengambil konten halaman" }
    }
}