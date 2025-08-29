// @/app/(public)/galeri/page.tsx
import { Metadata } from "next";
import { getGalleryCategories, getFeaturedGalleryItems } from "@/lib/actions/gallery-actions";
import { GalleryCategoryCard } from "@/components/molecules/gallery-category-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Grid3X3, Folder, ArrowRight } from "lucide-react";
import Link from "next/link";
import GalleryClientWrapper from "./gallery-client-wrapper";

export const metadata: Metadata = {
  title: "Galeri | Sanggar Tari Ngesti Laras Budaya",
  description: "Jelajahi koleksi foto dan video kegiatan, pertunjukan, dan momen berharga dari Sanggar Tari Ngesti Laras Budaya di Boja, Meteseh Boja, Kab. Kendal. Lihat dokumentasi tari tradisional, pertunjukan, dan kegiatan pembelajaran seni budaya.",
  keywords: [
    "sanggar tari",
    "ngesti laras budaya", 
    "boja kendal",
    "meteseh boja",
    "galeri foto tari",
    "video pertunjukan",
    "tari tradisional jawa",
    "kegiatan sanggar",
    "dokumentasi tari",
    "seni budaya indonesia",
    "pembelajaran tari",
    "studio dance",
    "tari anak",
    "performance dance"
  ].join(", "),
  authors: [
    {
      name: "Sanggar Tari Ngesti Laras Budaya",
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ngelaras.my.id'}`
    }
  ],
  creator: "Sanggar Tari Ngesti Laras Budaya",
  publisher: "Sanggar Tari Ngesti Laras Budaya",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ngelaras.my.id'}/galeri`,
    siteName: "Sanggar Tari Ngesti Laras Budaya",
    title: "Galeri Foto & Video | Sanggar Tari Ngesti Laras Budaya",
    description: "Koleksi lengkap foto dan video kegiatan, pertunjukan, dan momen berharga dari Sanggar Tari Ngesti Laras Budaya. Saksikan dokumentasi tari tradisional dan pembelajaran seni budaya di Boja, Kendal.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ngelaras.my.id'}/images/gallery-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Galeri Sanggar Tari Ngesti Laras Budaya - Foto dan Video Pertunjukan",
        type: "image/jpeg",
      },
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ngelaras.my.id'}/images/gallery-square.jpg`, 
        width: 800,
        height: 800,
        alt: "Galeri Sanggar Tari - Dokumentasi Kegiatan",
        type: "image/jpeg",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ngelarasbudaya",
    creator: "@ngelarasbudaya", 
    title: "Galeri Foto & Video | Sanggar Tari Ngesti Laras Budaya",
    description: "Koleksi lengkap foto dan video kegiatan, pertunjukan, dan momen berharga dari Sanggar Tari Ngesti Laras Budaya.",
    images: [`${process.env.NEXT_PUBLIC_APP_URL || 'https://ngelaras.my.id'}/images/gallery-og.jpg`],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ngelaras.my.id'}/galeri`,
    languages: {
      "id-ID": `${process.env.NEXT_PUBLIC_APP_URL || 'https://ngelaras.my.id'}/galeri`,
    },
  },
  category: "Arts & Culture",
  classification: "Gallery",
  other: {
    "format-detection": "telephone=no",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "msapplication-TileColor": "#2B5797",
    "theme-color": "#ffffff",
  },
};

async function GalleryPage() {
  const [categoriesResult, featuredResult] = await Promise.all([
    getGalleryCategories(),
    getFeaturedGalleryItems(6)
  ]);

  const categories = categoriesResult.success ? categoriesResult.data || [] : [];
  const featuredItems = featuredResult.success ? featuredResult.data || [] : [];

  const totalItems = categories.reduce((sum, cat) => sum + (cat._count?.items || 0), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Galeri</h1>
        <p className="text-lg text-muted-foreground max-w-5xl mx-auto">
          Jelajahi koleksi foto dan video kegiatan, pertunjukan, dan momen berharga dari Sanggar Tari Ngesti Laras Budaya
        </p>

        {/* Stats */}
        {(categories.length > 0 || totalItems > 0) && (
          <div className="flex justify-center items-center gap-6 mt-8 text-base">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Folder className="h-5 w-5" />
              <span>{categories.length} Kategori</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Camera className="h-5 w-5" />
              <span>{totalItems} Foto & Video</span>
            </div>
          </div>
        )}
      </div>

      {categories.length === 0 && featuredItems.length === 0 ? (
        <EmptyGalleryState />
      ) : (
        <div className="space-y-16">
          {/* Featured Gallery */}
          {featuredItems.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Galeri Unggulan</h2>
                  <p className="text-muted-foreground">Koleksi foto dan video terbaik dari kegiatan kami</p>
                </div>
                <Badge variant="outline" className="px-3 py-1">
                  <Grid3X3 className="h-4 w-4 mr-1" />
                  {featuredItems.length} item
                </Badge>
              </div>

              <GalleryClientWrapper items={featuredItems} />
            </section>
          )}

          {/* Categories */}
          {categories.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Kategori Galeri</h2>
                  <p className="text-muted-foreground">Jelajahi galeri berdasarkan kategori kegiatan</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <GalleryCategoryCard
                    key={category.id}
                    category={{
                      ...category,
                      description: category.description || undefined,
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Call to Action */}
          <section className="text-center">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-8">
                <Camera className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">
                  Ingin Tahu Lebih Banyak?
                </h3>
                <p className="text-base text-muted-foreground mb-6 max-w-5xl mx-auto">
                  Bergabunglah dengan kami dan jadilah bagian dari momen-momen indah ini. Pelajari seni tari bersama instruktur berpengalaman.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link href="/kontak">
                      Hubungi Kami
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/tentang-kami">
                      Tentang Kami
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      )}
    </div>
  );
}

function EmptyGalleryState() {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-6">📸</div>
      <h3 className="text-2xl font-semibold mb-4">Galeri Akan Segera Hadir</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Kami sedang mempersiapkan koleksi foto dan video terbaik dari kegiatan sanggar. Pantau terus untuk melihat momen-momen indah kami!
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild>
          <Link href="/kontak">Hubungi Kami</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/artikel">Baca Artikel</Link>
        </Button>
      </div>
    </div>
  );
}

export default GalleryPage;