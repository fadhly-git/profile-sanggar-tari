import { PrismaClient } from '@prisma/client'
import type { SettingType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
   await prisma.user.upsert({
    where: { email: 'admin@sanggar-tari.com' },
    update: {},
    create: {
      email: 'admin@sanggar-tari.com',
      name: 'Administrator',
      password: hashedPassword,
      role: 'SUPER_ADMIN'
    }
  })

  // Create default page contents
  const pageContents = [
    {
      pageKey: 'about_us',
      title: 'Tentang Kami',
      content: 'Sanggar Tari Nusantara adalah...'
    },
    {
      pageKey: 'vision_mission',
      title: 'Visi & Misi',
      content: JSON.stringify({
        vision: 'Menjadi sanggar tari terdepan...',
        mission: ['Mengembangkan seni tari tradisional...', 'Memberikan edukasi...']
      })
    },
    {
      pageKey: 'history',
      title: 'Sejarah',
      content: 'Sanggar Tari Nusantara didirikan pada...'
    },
    {
      pageKey: 'contact_info',
      title: 'Informasi Kontak',
      content: '',
      metadata: JSON.stringify({
        address: 'Jl. Contoh No. 123, Jakarta',
        phone: '+62 21 1234567',
        email: 'info@sanggar-tari.com',
        operatingHours: 'Senin - Sabtu: 09:00 - 17:00'
      })
    }
  ]

  for (const content of pageContents) {
    await prisma.pageContent.upsert({
      where: { pageKey: content.pageKey },
      update: {},
      create: content
    })
  }

  // Create default settings

  
  const settings = [
    { key: 'site_title', value: 'Sanggar Tari Nusantara', type: 'TEXT' as SettingType },
    { key: 'site_description', value: 'Sanggar tari tradisional dan modern untuk anak-anak', type: 'TEXTAREA' as SettingType },
    { key: 'hero_title', value: 'Selamat Datang di Sanggar Tari Nusantara', type: 'TEXT' as SettingType },
    { key: 'hero_subtitle', value: 'Tempat belajar tari tradisional dan modern untuk anak-anak', type: 'TEXT' as SettingType },
    { key: 'hero_cta_text', value: 'Daftar Sekarang', type: 'TEXT' as SettingType },
    { key: 'theme_color', value: 'golden', type: 'TEXT' as SettingType }
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    })
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })