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

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `Admin Panel - ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
        description: "Manage your website settings and content",
        icons: process.env.NEXT_PUBLIC_FAVICON_URL,

    }
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
                    <SiteHeader />
                    <div className="flex flex-1">
                        <AppSidebar appName={"Ngelaras"} />
                        <SidebarInset className="flex flex-1 overflow-hidden">
                            <div className="h-full">
                                <MainScrollArea>
                                    {children}
                                </MainScrollArea>
                            </div>
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </div>
        </Providers>
    )
}