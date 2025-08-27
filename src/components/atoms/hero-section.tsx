'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { HeroSection as HeroSectionType } from '@prisma/client'
import Link from 'next/link'

interface HeroSectionProps {
  title: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  backgroundImages?: HeroSectionType[]
  autoSlideInterval?: number // interval dalam milidetik
}

export default function HeroSection({
  title,
  subtitle,
  ctaText,
  ctaLink = '/kontak',
  backgroundImages = [],
  autoSlideInterval = 5000,
}: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto slide carousel
  useEffect(() => {
    if (backgroundImages.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      )
    }, autoSlideInterval)

    return () => clearInterval(timer)
  }, [backgroundImages, autoSlideInterval])

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
      {backgroundImages.length > 0 && (
        <div className="absolute inset-0">
          {backgroundImages.map((bgImage, index) => (
            <div
              key={bgImage.id}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-30' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${bgImage.imageUrl})` }}
            />
          ))}
        </div>
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