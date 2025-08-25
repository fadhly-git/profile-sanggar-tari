// @/components/layout/header.tsx

'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getAllSettingsObj } from '@/lib/actions/setting-actions'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const navigationItems = [
    { href: '/', label: 'Beranda' },
    { href: '/tentang-kami', label: 'Tentang Kami' },
    { href: '/artikel', label: 'Artikel' },
    { href: '/galeri', label: 'Galeri' },
    { href: '/kontak', label: 'Kontak Kami' },
]

// Hook untuk mendeteksi active state
function useActiveNavigation() {
    const pathname = usePathname()

    const isActive = (href: string) => {
        // Exact match untuk home page
        if (href === '/') {
            return pathname === '/'
        }

        // Untuk path lainnya, cek apakah pathname dimulai dengan href
        // Ini akan menangani kasus seperti /galeri/slug-nya
        return pathname.startsWith(href)
    }

    return { isActive, pathname }
}

// Component untuk Navigation Item
function NavigationItem({
    href,
    label,
    isActive,
    className = ""
}: {
    href: string
    label: string
    isActive: boolean
    className?: string
}) {
    return (
        <Link
            href={href}
            className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative",
                isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground",
                className
            )}
        >
            {label}
            {isActive && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
            )}
        </Link>
    )
}

// Component untuk Mobile Navigation Item
function MobileNavigationItem({
    href,
    label,
    isActive
}: {
    href: string
    label: string
    isActive: boolean
}) {
    return (
        <Link
            href={href}
            className={cn(
                "text-lg font-medium transition-colors hover:text-primary p-2 rounded-md",
                isActive
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-muted-foreground hover:bg-muted"
            )}
        >
            {label}
        </Link>
    )
}

export function HeaderContentClient({
    settings,
    siteName,
    siteLogo
}: {
    settings: { site_name?: string; site_logo?: string; hero_cta_text?: string }
    siteName: string
    siteLogo: string
}) {
    const { isActive } = useActiveNavigation()

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
                            <NavigationItem
                                key={item.href}
                                href={item.href}
                                label={item.label}
                                isActive={isActive(item.href)}
                            />
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
                                    <MobileNavigationItem
                                        key={item.href}
                                        href={item.href}
                                        label={item.label}
                                        isActive={isActive(item.href)}
                                    />
                                ))}
                                <div className="pt-4 border-t">
                                    <Button asChild className="w-full">
                                        <Link href="/kontak">
                                            {settings?.hero_cta_text || 'Hubungi Kami'}
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

