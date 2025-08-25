// @/components/layout/header.tsx

import { Suspense } from 'react'
import Link from 'next/link'
import { getAllSettingsObj } from '@/lib/actions/setting-actions'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Image from 'next/image'

const navigationItems = [
    { href: '/', label: 'Beranda' },
    { href: '/tentang-kami', label: 'Tentang Kami' },
    { href: '/artikel', label: 'Artikel' },
    { href: '/galeri', label: 'Galeri' },
    { href: '/kontak', label: 'Kontak Kami' },
]

async function HeaderContent() {
    const settingsResult = await getAllSettingsObj()
    const settings: { site_name?: string; site_logo?: string; hero_cta_text?: string } = settingsResult.success && settingsResult.data ? settingsResult.data : {}
    
    const siteName = settings.site_name || 'Sanggar Tari Ngesti Laras Budaya'
    const siteLogo = settings.site_logo || '/logo.png'
    
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        {siteLogo && (
                          <Image
                            src={siteLogo ?? '/logo.png'}
                            width={32}
                            height={32}
                            unoptimized
                            alt={siteName}
                            className="h-8 w-8 object-contain"
                        />
                        )}
                        <span className="font-bold text-lg hidden sm:inline-block">
                            {siteName}
                        </span>
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    
                    {/* CTA Button */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Button asChild>
                            <Link href="/kontak">
                                {settings?.hero_cta_text || 'Hubungi Kami'}
                            </Link>
                        </Button>
                    </div>
                    
                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80">
                            <div className="flex flex-col space-y-4 mt-6">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="text-lg font-medium transition-colors hover:text-primary p-2"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="pt-4 border-t">
                                    <Button asChild className="w-full">
                                        <Link href="/kontak">
                                            {settings.hero_cta_text || 'Hubungi Kami'}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
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