import { getAllSettingsObj } from "@/lib/actions/setting-actions";
import { Suspense } from "react";
import { HeaderContentClient } from "@/components/layout/header";

async function HeaderContent() {
    const settingsResult = await getAllSettingsObj()
    const settings: { site_name?: string; site_logo?: string; hero_cta_text?: string } = 
        settingsResult.success && settingsResult.data ? settingsResult.data : {}

    const siteName = settings.site_name || 'Sanggar Tari Ngesti Laras Budaya'
    const siteLogo = settings.site_logo || '/logo.png'

    return (
        <HeaderContentClient settings={settings} siteName={siteName} siteLogo={siteLogo} />
    )
}

export function Header() {
    return (
        <Suspense fallback={
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
                        <div className="hidden md:flex space-x-6">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-4 w-16 bg-muted rounded animate-pulse" />
                            ))}
                        </div>
                        <div className="h-10 w-24 bg-muted rounded animate-pulse" />
                    </div>
                </div>
            </header>
        }>
            <HeaderContent />
        </Suspense>
    )
}