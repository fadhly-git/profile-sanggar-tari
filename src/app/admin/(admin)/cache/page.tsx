// /app/admin/cache/page.tsx
import { Metadata } from 'next'
import CacheManager from '@/components/admin/cache-manager'

export const metadata: Metadata = {
    title: 'Cache Management - Admin',
    description: 'Kelola cache website untuk performa optimal'
}

export default function CachePage() {
    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Cache Management</h1>
                <p className="text-gray-600 mt-2">
                    Kelola dan pantau cache website untuk memastikan performa optimal.
                    Gunakan fitur ini ketika konten tidak terupdate atau setelah melakukan perubahan besar.
                </p>
            </div>
            <CacheManager />
        </div>
    )
}