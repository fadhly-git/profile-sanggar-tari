// @/components/layout/footer.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { getAllSettingsObj } from '@/lib/actions/setting-actions'
import { getPageContentByKey } from '@/lib/actions/page-content-actions'
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'

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
                        <h3 className="font-bold text-lg">{siteName}</h3>
                        <p className="text-sm text-muted-foreground">
                            {siteDescription}
                        </p>
                        <div className="flex space-x-4">
                            {contactData.instagram && (
                                <Link 
                                    href={contactData.instagram}
                                    className="text-muted-foreground hover:text-primary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Instagram className="h-5 w-5" />
                                </Link>
                            )}
                            {contactData.tiktok && (
                                <Link 
                                    href={contactData.tiktok}
                                    className="text-muted-foreground hover:text-primary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.16 20.5a6.34 6.34 0 0 0 10.86-4.43V7.83a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.26z"/>
                                    </svg>
                                </Link>
                            )}
                            {contactData.facebook && (
                                <Link 
                                    href={contactData.facebook}
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
                    <p>&copy; {new Date().getFullYear()} {siteName}. Semua hak dilindungi.</p>
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