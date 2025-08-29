// @/components/layout/footer.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { getAllSettingsObj } from '@/lib/actions/setting-actions'
import { getPageContentByKey } from '@/lib/actions/page-content-actions'
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import { TikTokIcon } from '../atoms/d'

async function FooterContent() {
    const [settingsResult, contactResult] = await Promise.all([
        getAllSettingsObj(),
        getPageContentByKey('contact_info')
    ])

    const settings = settingsResult.success ? settingsResult.data : {}
    const contactInfo = contactResult.success ? contactResult.data : null

    const siteName = settings?.site_name || 'Sanggar Tari Ngesti Laras Budaya'
    const siteDescription = settings?.site_description || 'Sanggar tari tradisional dan modern untuk anak-anak'

    // Parse contact metadata
    const contactData = contactInfo?.metadata || {}

    return (
        <footer className="bg-muted/50 border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <Link href="/" className='cursor-pointer'>
                            <h3 className="font-bold text-base">{siteName}</h3>
                        </Link>
                        <p className="text-sm text-justify text-muted-foreground">
                            {siteDescription}
                        </p>
                        <div className="flex space-x-4">
                            {contactData.socialMedia.instagram && (
                                <Link
                                    href={contactData.socialMedia.instagram}
                                    className="text-muted-foreground hover:text-primary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Instagram className="h-5 w-5" />
                                </Link>
                            )}
                            {contactData.socialMedia.tiktok && (
                                <Link
                                    href={contactData.socialMedia.tiktok}
                                    className="text-muted-foreground hover:text-primary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div className="h-5 w-5">
                                        <TikTokIcon className='w-5 h-5' />
                                    </div>
                                </Link>
                            )}
                            {contactData.socialMedia.facebook && (
                                <Link
                                    href={contactData.socialMedia.facebook}
                                    className="text-muted-foreground hover:text-primary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Facebook className="h-5 w-5" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Menu</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="text-muted-foreground hover:text-primary">Beranda</Link></li>
                            <li><Link href="/tentang-kami" className="text-muted-foreground hover:text-primary">Tentang Kami</Link></li>
                            <li><Link href="/artikel" className="text-muted-foreground hover:text-primary">Artikel</Link></li>
                            <li><Link href="/galeri" className="text-muted-foreground hover:text-primary">Galeri</Link></li>
                            <li><Link href="/kontak" className="text-muted-foreground hover:text-primary">Kontak Kami</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Kontak</h4>
                        <div className="space-y-2 text-sm">
                            {contactData.address && (
                                <div className="flex items-start space-x-2">
                                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                    <span className="text-muted-foreground">{contactData.address}</span>
                                </div>
                            )}
                            {contactData.phone && (
                                <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{contactData.phone}</span>
                                </div>
                            )}
                            {contactData.email && (
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{contactData.email}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Operating Hours */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Jam Operasional</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            {contactData.operating_hours ? (
                                <div dangerouslySetInnerHTML={{ __html: contactData.operating_hours }} />
                            ) : (
                                <>
                                    <p>Senin - Jumat: 16:00 - 20:00</p>
                                    <p>Sabtu - Minggu: 09:00 - 17:00</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export function Footer() {
    return (
        <Suspense fallback={
            <footer className="bg-muted/50 border-t">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                                <div className="space-y-2">
                                    {[...Array(4)].map((_, j) => (
                                        <div key={j} className="h-4 w-full bg-muted rounded animate-pulse" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </footer>
        }>
            <FooterContent />
        </Suspense>
    )
}