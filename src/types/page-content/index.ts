export interface PageContent {
  id: string
  pageKey: string
  title: string
  content: string
  metadata: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export const PAGE_KEY_OPTIONS = [
  { value: 'about_us', label: 'Tentang Kami' },
  { value: 'vision_mission', label: 'Visi & Misi' },
  { value: 'history', label: 'Sejarah' },
  { value: 'contact_info', label: 'Info Kontak' }
]

export function getPageKeyLabel(pageKey: string) {
  const option = PAGE_KEY_OPTIONS.find(opt => opt.value === pageKey)
  return option?.label || pageKey
}