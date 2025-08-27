import '@/app/admin/admin.css'
import { Providers } from '../providers'
import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { redirect } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { MainScrollArea } from '@/components/main-scroll'
import { getServerSession } from 'next-auth'
import { Metadata } from 'next'
import { authOptions } from '@/lib/auth-options'
import { Suspense } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `Admin Panel - ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
        description: "Manage your website settings and content",
        icons: process.env.NEXT_PUBLIC_FAVICON_URL,
    }
}

// Loading component untuk content area
function AdminContentLoading() {
    return (
        <div className="space-y-6 p-6">
            {/* Header skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Stats cards skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main content skeleton */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <div className="space-y-2">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 flex-1" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Loading component untuk sidebar
function SidebarLoading() {
    return (
        <div className="w-64 border-r bg-background p-4">
            <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 flex-1" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Loading component untuk header
function HeaderLoading() {
    return (
        <header className="border-b bg-background px-4 py-3">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-6 w-24" />
                </div>
            </div>
        </header>
    )
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions);
    if (!session) { redirect('/admin/login') }

    return (
        <Providers>
            <div className="[--header-height:calc(--spacing(14))] h-screen flex flex-col overflow-hidden">
                <SidebarProvider className="flex flex-col flex-1">
                    {/* Header dengan Suspense */}
                    <Suspense fallback={<HeaderLoading />}>
                        <SiteHeader />
                    </Suspense>

                    <div className="flex flex-1">
                        {/* Sidebar dengan Suspense */}
                        <Suspense fallback={<SidebarLoading />}>
                            <AppSidebar appName={"Ngelaras"} />
                        </Suspense>

                        <SidebarInset className="flex flex-1 overflow-hidden">
                            <div className="h-full">
                                <MainScrollArea bottomSpacing='2xl'>
                                    {/* Main content dengan Suspense */}
                                    <Suspense fallback={<AdminContentLoading />}>
                                        {children}
                                    </Suspense>
                                </MainScrollArea>
                            </div>
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </div>
        </Providers>
    )
}