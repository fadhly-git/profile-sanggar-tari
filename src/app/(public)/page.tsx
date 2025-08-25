// @/app/(public)/page.tsx
import { Suspense } from 'react'
import { Metadata } from 'next'
import HeroSection from '@/components/atoms/hero-section'
import SectionHeader from '@/components/atoms/section-header'
import ArticleCard from '@/components/molecules/article-card'
import ScheduleCard from '@/components/molecules/schedule-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { getAllSettings } from '@/lib/actions/setting-actions'
import { getPageContentByKey } from '@/lib/actions/page-content-actions'
import { getPublishedArticles } from '@/lib/actions/articles-action'
import { getUpcomingSchedules } from '@/lib/actions/schedule-actions'
import Image from 'next/image'

export async function generateMetadata(): Promise<Metadata> {
  const settingsResult = await getAllSettings()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings: { site_name?: string; site_description?: string;[key: string]: any } = settingsResult.success && settingsResult.data ? settingsResult.data : {}

  return {
    title: settings.site_name || 'Sanggar Tari Ngesti Laras Budaya',
    description: settings.site_description || 'Sanggar tari tradisional dan modern untuk anak-anak',
    keywords: 'sanggar tari, tari tradisional, tari modern, anak, budaya, yogyakarta',
    openGraph: {
      title: settings.site_name || 'Sanggar Tari Ngesti Laras Budaya',
      description: settings.site_description || 'Sanggar tari tradisional dan modern untuk anak-anak',
      type: 'website',
      locale: 'id_ID'
    }
  }
}

async function HeroContent() {
  const settingsResult = await getAllSettings()
  const settings = settingsResult.success ? (settingsResult.data as { hero_title?: string; hero_subtitle?: string; hero_cta_text?: string }) : {}

  return (
    <HeroSection
      title={settings?.hero_title || 'Selamat Datang di Sanggar Tari Ngesti Laras Budaya'}
      subtitle={settings.hero_subtitle || 'Tempat belajar tari tradisional dan modern untuk anak'}
      ctaText={settings.hero_cta_text || 'Hubungi Kami'}
      ctaLink="/kontak"
    />
  )
}

async function AboutSection() {
  const aboutResult = await getPageContentByKey('about_us')
  const aboutData = aboutResult.success ? aboutResult.data : null

  if (!aboutData) return null

  const metadata = aboutData.metadata || {}

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <SectionHeader
              title="Tentang Kami"
              subtitle={`Lebih dari ${metadata.founded_year ? new Date().getFullYear() - parseInt(metadata.founded_year, 10) : '25'} tahun mengembangkan bakat seni tari`}
            />
            <div dangerouslySetInnerHTML={{ __html: aboutData.content }} className="prose max-w-none" />
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {metadata.founded_year || '1995'}
                  </div>
                  <div className="text-sm text-muted-foreground">Tahun Berdiri</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {metadata.total_students || '200+'}
                  </div>
                  <div className="text-sm text-muted-foreground">Siswa Aktif</div>
                </CardContent>
              </Card>
            </div>
            <Button asChild>
              <Link href="/tentang-kami">Pelajari Lebih Lanjut</Link>
            </Button>
          </div>
          <div className="aspect-square overflow-hidden rounded-lg">
            <Image
              src="/logo.png"
              alt="Sanggar Tari Ngesti Laras Budaya"
              className="w-full h-full object-cover"
              width={600}
              height={600}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

async function ScheduleSection() {
  const scheduleResult = await getUpcomingSchedules(3)
  const schedules = scheduleResult.success && scheduleResult.data ? scheduleResult.data : []

  if (schedules.length === 0) return null

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <SectionHeader
            title="Jadwal Kegiatan"
            subtitle="Kegiatan dan acara mendatang di sanggar"
            centered
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              title={schedule.title}
              isRecurring={schedule.isRecurring}
              recurringType={schedule.recurringType || 'WEEKLY'}
              description={schedule.description || undefined}
              startDate={schedule.startDate}
              endDate={schedule.endDate || undefined}
              location={schedule.location || undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

async function NewsSection() {
  const articlesResult = await getPublishedArticles(3)
  console.log('Articles Fetch Result:', articlesResult)
  const articles = articlesResult || []

  if (articles.length === 0) return null

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <SectionHeader
            title="Berita & Artikel"
            subtitle="Kabar terbaru dari Sanggar Tari Ngesti Laras Budaya"
            centered
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              slug={article.slug}
              excerpt={article.excerpt || undefined}
              featuredImage={article.featuredImage || undefined}
              publishedAt={article.publishedAt!}
              author={article.author}
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild>
            <Link href="/artikel">Baca Semua Artikel</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
        </div>
      }>
        <HeroContent />
      </Suspense>

      <Suspense fallback={
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-muted rounded" />
                  ))}
                </div>
                <div className="aspect-square bg-muted rounded" />
              </div>
            </div>
          </div>
        </section>
      }>
        <AboutSection />
      </Suspense>

      <Suspense fallback={
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-muted rounded" />
                ))}
              </div>
            </div>
          </div>
        </section>
      }>
        <ScheduleSection />
      </Suspense>

      <Suspense fallback={
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-80 bg-muted rounded" />
                ))}
              </div>
            </div>
          </div>
        </section>
      }>
        <NewsSection />
      </Suspense>
    </>
  )
}