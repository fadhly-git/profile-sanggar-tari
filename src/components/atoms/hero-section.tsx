// @/components/atoms/hero-section.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HeroSectionProps {
    title: string
    subtitle?: string
    ctaText?: string
    ctaLink?: string
    backgroundImage?: string
}

export default function HeroSection({
    title,
    subtitle,
    ctaText,
    ctaLink = '/kontak',
    backgroundImage
}: HeroSectionProps) {
    return (
        <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            {backgroundImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 h-full w"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            )}
            <div className="relative z-10 container mx-auto px-4 text-center space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                        {subtitle}
                    </p>
                )}
                {ctaText && (
                    <Button size="lg" asChild className="mt-8">
                        <Link href={ctaLink}>{ctaText}</Link>
                    </Button>
                )}
            </div>
        </section>
    )
}