import { notFound } from 'next/navigation'
import { getHeroSectionById } from '@/lib/actions/hero-section-actions'
import { HeroSectionForm } from '@/components/admin/hero-section/hero-section-form'

interface EditHeroSectionPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditHeroSectionPage({ params }: EditHeroSectionPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const heroSection = await getHeroSectionById(id)

  if (!heroSection) {
    notFound()
  }

  return <HeroSectionForm heroSection={heroSection} mode="edit" />
}