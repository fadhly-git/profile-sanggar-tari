import { notFound } from 'next/navigation'
import { getHeroSectionById } from '@/lib/actions/hero-section-actions'
import { HeroSectionForm } from '@/components/admin/hero-section/hero-section-form'

interface EditHeroSectionPageProps {
  params: {
    id: string
  }
}

export default async function EditHeroSectionPage({ params }: EditHeroSectionPageProps) {
  const heroSection = await getHeroSectionById(params.id)

  if (!heroSection) {
    notFound()
  }

  return <HeroSectionForm heroSection={heroSection} mode="edit" />
}