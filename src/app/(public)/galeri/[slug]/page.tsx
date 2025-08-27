// @/app/(public)/galeri/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGalleryItemsByCategory, getGalleryCategories } from "@/lib/actions/gallery-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Grid3X3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import GalleryClientWrapper from "../gallery-client-wrapper";
import GalleryCategoryPagination from "./gallery-category-pagination";

interface GalleryCategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: GalleryCategoryPageProps): Promise<Metadata> {
  const reviewedParams = await params;
  const {slug} = reviewedParams;
  const categoryResult = await getGalleryItemsByCategory(slug, 1, 1);

  if (!categoryResult.success || !categoryResult.data?.category) {
    return {
      title: "Kategori Tidak Ditemukan - Sanggar Tari Ngesti Laras Budaya",
    };
  }

  const category = categoryResult.data.category;
  
  return {
    title: `${category.title} - Galeri Sanggar Tari Ngesti Laras Budaya`,
    description: category.description || `Lihat koleksi foto dan video ${category.title} dari Sanggar Tari Ngesti Laras Budaya di Boja, Meteseh Boja, Kab. Kendal.`,
    keywords: `sanggar tari, ngesti laras budaya, galeri, ${category.title}, boja, meteseh boja, Kab. Kendal`,
    openGraph: {
      title: `${category.title} - Galeri Sanggar Tari Ngesti Laras Budaya`,
      description: category.description || `Lihat koleksi foto dan video ${category.title} dari Sanggar Tari Ngesti Laras Budaya.`,
      url: `https://ngelaras.my.id/galeri/${category.slug}`,
      siteName: "Sanggar Tari Ngesti Laras Budaya",
      locale: "id_ID",
      type: "website",
    },
    alternates: {
      canonical: `https://ngelaras.my.id/galeri/${category.slug}`,
    },
  };
}

const ITEMS_PER_PAGE = 12;

async function GalleryCategoryPage({ params, searchParams }: GalleryCategoryPageProps) {
  const reviewedParams = await params;
  const reviewedSearchParams = await searchParams;
  const { slug } = reviewedParams;
  const { page } = reviewedSearchParams;
  const currentPage = parseInt(page || "1");

  const [categoryResult, allCategoriesResult] = await Promise.all([
    getGalleryItemsByCategory(slug, currentPage, ITEMS_PER_PAGE),
    getGalleryCategories()
  ]);
  
  if (!categoryResult.success || !categoryResult.data?.category) {
    notFound();
  }

  const { category, items, totalCount, totalPages, hasNextPage, hasPrevPage } = categoryResult.data;
  const allCategories = allCategoriesResult.success ? allCategoriesResult.data || [] : [];
  const otherCategories = allCategories.filter(cat => cat.slug !== slug);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link href="/galeri">
          <Button variant="ghost" className="p-0 h-auto mb-4 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Galeri
          </Button>
        </Link>
      </div>

      {/* Category Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{category.title}</h1>
        {category.description && (
          <p className="text-base text-pretty md:text-balance text-muted-foreground max-w-7xl mx-auto mb-6">
            {category.description}
          </p>
        )}
        
        <div className="flex justify-center items-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            <Camera className="h-4 w-4 mr-1" />
            {totalCount} item
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Grid3X3 className="h-4 w-4 mr-1" />
            Halaman {currentPage} dari {totalPages}
          </Badge>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyCategoryState categoryName={category.title} />
      ) : (
        <div className="space-y-12">
          {/* Gallery Items */}
          <section>
            <GalleryClientWrapper items={items} />
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <GalleryCategoryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              categorySlug={slug}
            />
          )}

          {/* Results Info */}
          <div className="text-center text-sm text-muted-foreground">
            Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} dari {totalCount} item
          </div>
        </div>
      )}

      {/* Other Categories */}
      {otherCategories.length > 0 && (
        <section className="mt-16">
          <div className="border-t pt-12">
            <h2 className="text-2xl font-bold text-center mb-8">Kategori Lainnya</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCategories.slice(0, 3).map((cat) => (
                <div key={cat.id} className="text-center">
                  <Link 
                    href={`/galeri/${cat.slug}`}
                    className="group block"
                  >
                    <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                      <Image
                        src={cat.items[0]?.imageUrl || "/logo.png"}
                        alt={cat.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Badge className="bg-black/50 text-white backdrop-blur-sm">
                          {cat._count?.items || 0} item
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                  </Link>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/galeri">Lihat Semua Kategori</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function EmptyCategoryState({ categoryName }: { categoryName: string }) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-6">📷</div>
      <h3 className="text-2xl font-semibold mb-4">Belum Ada Konten</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Kategori &quot;{categoryName}&quot; belum memiliki foto atau video. Konten akan segera ditambahkan.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild>
          <Link href="/galeri">Kembali ke Galeri</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/kontak">Hubungi Kami</Link>
        </Button>
      </div>
    </div>
  );
}

export default GalleryCategoryPage;