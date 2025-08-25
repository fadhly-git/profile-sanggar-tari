// @/components/molecules/gallery-4.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
    Carousel, 
    CarouselContent, 
    CarouselItem,
    CarouselApi 
} from '@/components/ui/carousel'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface GalleryItem {
    id: string
    title: string
    description?: string
    imageUrl: string
    category?: {
        title: string
        slug: string
    }
}

interface Gallery4Props {
    title?: string
    description?: string
    items: GalleryItem[]
}

const Gallery4 = ({
    title = 'Ujian Tari Sanggar Tari Ngesti Laras Budaya Tahun 2023',
    description = 'Koleksi momen berharga dari berbagai kegiatan dan pertunjukan tari di Sanggar Tari Ngesti Laras Budaya. Setiap foto menceritakan perjalanan seni dan budaya yang kami lestarikan bersama.',
    items,
}: Gallery4Props) => {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>()
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        if (!carouselApi) {
            return
        }
        const updateSelection = () => {
            setCanScrollPrev(carouselApi.canScrollPrev())
            setCanScrollNext(carouselApi.canScrollNext())
            setCurrentSlide(carouselApi.selectedScrollSnap())
        }
        updateSelection()
        carouselApi.on('select', updateSelection)
        return () => {
            carouselApi.off('select', updateSelection)
        }
    }, [carouselApi])

    if (!items || items.length === 0) {
        return null
    }

    return (
        <section className="flex w-full items-center justify-center pt-12">
            <div className="container flex flex-col items-center gap-16">
                <div className="max-w-5xl container">
                    <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
                        <div className="flex flex-col gap-4 w-full">
                            <h2 className="text-2xl font-medium md:text-2xl lg:text-3xl capitalize text-center">
                                {title}
                            </h2>
                            <p className="text-muted-foreground max-w-lg text-wrap text-justify">
                                {description}
                            </p>
                        </div>
                        <div className="hidden shrink-0 gap-2 md:flex">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                    carouselApi?.scrollPrev()
                                }}
                                disabled={!canScrollPrev}
                                className="disabled:pointer-events-auto"
                                aria-label="Gambar sebelumnya"
                            >
                                <ArrowLeft className="size-5" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                    carouselApi?.scrollNext()
                                }}
                                disabled={!canScrollNext}
                                className="disabled:pointer-events-auto"
                                aria-label="Gambar selanjutnya"
                            >
                                <ArrowRight className="size-5" />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-7xl">
                    <Carousel
                        setApi={setCarouselApi}
                        opts={{
                            breakpoints: {
                                '(max-width: 768px)': {
                                    dragFree: true,
                                },
                            },
                        }}
                    >
                        <CarouselContent className="ml-0 2xl:mr-[max(0rem,calc(50vw-700px))] 2xl:ml-[max(8rem,calc(50vw-700px))]">
                            {items.map((item) => (
                                <CarouselItem 
                                    key={item.id} 
                                    className="max-w-[320px] pl-[20px] lg:max-w-[360px]"
                                >
                                    <div className="group rounded-xl">
                                        <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9]">
                                            <Image
                                                width={600}
                                                height={400}
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 h-full bg-[linear-gradient(transparent_20%,var(--secondary)_100%)] mix-blend-multiply" />
                                            <div className="text-secondary-foreground absolute inset-x-0 bottom-0 flex flex-col items-start p-6 md:p-8">
                                                <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4">
                                                    {item.title}
                                                </div>
                                                {item.description && (
                                                    <div className="mb-8 line-clamp-2 md:mb-12 lg:mb-9">
                                                        {item.description}
                                                    </div>
                                                )}
                                                {item.category && (
                                                    <div className="text-sm opacity-75">
                                                        {item.category.title}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <div className="mt-8 flex justify-center gap-2">
                        {items.map((_, index) => (
                            <button
                                key={index}
                                className={`h-2 w-2 rounded-full transition-colors ${
                                    currentSlide === index ? 'bg-primary' : 'bg-primary/20'
                                }`}
                                onClick={() => carouselApi?.scrollTo(index)}
                                aria-label={`Ke slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export { Gallery4 }