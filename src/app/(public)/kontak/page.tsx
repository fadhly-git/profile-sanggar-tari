/* eslint-disable @typescript-eslint/no-explicit-any */
// @/app/(public)/kontak/page.tsx
import { Metadata } from "next";
import { getPageContentByKey } from "@/lib/actions/page-content-actions";
import { getActiveFaqs } from "@/lib/actions/faq-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, MessageSquare, Facebook, Instagram } from "lucide-react";
import ContactForm from "./contact-form";
import { TikTokIcon } from "@/components/atoms/d";
import { MapEmbed } from "@/components/molecules/map-embed";
import { FaqSection } from "@/components/molecules/faq-section";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Kontak Kami | Sanggar Tari Ngesti Laras Budaya",
    description: "Hubungi kami untuk informasi lebih lanjut tentang kelas tari, jadwal, dan pendaftaran di Sanggar Tari Ngesti Laras Budaya. Bergabunglah dengan sanggar tari terbaik di Boja, Meteseh Boja, Kab. Kendal untuk belajar tari tradisional dan modern.",
    keywords: [
        "kontak sanggar tari",
        "ngesti laras budaya",
        "hubungi kami",
        "alamat sanggar tari",
        "telepon sanggar tari",
        "email sanggar tari",
        "whatsapp sanggar tari",
        "informasi pendaftaran",
        "kelas tari",
        "boja kendal",
        "meteseh boja",
        "jadwal tari",
        "biaya kelas tari",
        "tari tradisional",
        "pembelajaran tari"
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
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ngelaras.my.id'}/kontak`,
        siteName: "Sanggar Tari Ngesti Laras Budaya",
        title: "Kontak Kami | Sanggar Tari Ngesti Laras Budaya",
        description: "Hubungi Sanggar Tari Ngesti Laras Budaya untuk informasi pendaftaran, jadwal kelas, dan pembelajaran tari tradisional. Bergabunglah dengan kami di Boja, Kendal untuk mengembangkan bakat seni tari Anda.",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ngelaras.my.id'}/images/contact-og.jpg`,
                width: 1200,
                height: 630,
                alt: "Kontak Sanggar Tari Ngesti Laras Budaya - Hubungi Kami",
                type: "image/jpeg",
            },
            {
                url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ngelaras.my.id'}/images/contact-square.jpg`,
                width: 800,
                height: 800,
                alt: "Sanggar Tari Ngesti Laras Budaya - Informasi Kontak",
                type: "image/jpeg",
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@ngelarasbudaya",
        creator: "@ngelarasbudaya",
        title: "Kontak Kami | Sanggar Tari Ngesti Laras Budaya",
        description: "Hubungi Sanggar Tari Ngesti Laras Budaya untuk informasi pendaftaran, jadwal kelas, dan pembelajaran tari tradisional.",
        images: [`${process.env.NEXT_PUBLIC_APP_URL || 'https://ngelaras.my.id'}/images/contact-og.jpg`],
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ngelaras.my.id'}/kontak`,
        languages: {
            "id-ID": `${process.env.NEXT_PUBLIC_APP_URL || 'https://ngelaras.my.id'}/kontak`,
        },
    },
    category: "Arts & Culture",
    classification: "Contact Information",
    other: {
        "format-detection": "telephone=no",
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "default",
        "msapplication-TileColor": "#2B5797",
        "theme-color": "#ffffff",
    },
};

async function ContactPage() {
    const contactInfoResult = await getPageContentByKey("contact_info");
    const faqsResult = await getActiveFaqs();

    // Parse contact info dari metadata jika ada
    const contactInfo = contactInfoResult.success && contactInfoResult.data?.metadata
        ? contactInfoResult.data.metadata
        : null;

    // Default contact info jika tidak ada di database
    const defaultContactInfo = {
        address: "Jl. Contoh No. 123, Jakarta",
        phone: "08123456789",
        email: "info@sanggar-tari.com",
        whatsapp: "08123456789",
        operatingHours: [
            { days: "Minggu", hours: "08:00 - 10:00" }
        ],
        socialMedia: {
            instagram: "@sanggartari",
            tiktok: "@sanggartari",
            facebook: "Sanggar Tari Ngesti Laras Budaya"
        },
        embed_map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.4035346169576!2d110.2893699759459!3d-7.079127369392191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7063c2203cba8d%3A0x3488c03e20d7c214!2sKampoeng%20Lawas!5e0!3m2!1sen!2sid!4v1756194291307!5m2!1sen!2sid",
    };

    const info = contactInfo || defaultContactInfo;
    const faqs = faqsResult.success ? faqsResult.data ?? [] : [];
    const defaultFaqs = [
        {
            id: "1",
            question: "Berapa biaya untuk bergabung di sanggar tari?",
            answer: "Biaya pendaftaran sangat terjangkau. Untuk informasi detail mengenai paket pembelajaran dan biaya, silakan hubungi kami langsung melalui WhatsApp atau datang langsung ke sanggar."
        },
        {
            id: "2",
            question: "Apakah ada batasan usia untuk bergabung?",
            answer: "Kami menerima siswa dari berbagai usia, mulai dari anak-anak hingga dewasa. Setiap kelompok usia memiliki kelas dan metode pembelajaran yang disesuaikan."
        },
        {
            id: "3",
            question: "Apa saja jenis tari yang diajarkan?",
            answer: "Kami mengajarkan berbagai jenis tari tradisional Indonesia seperti tari Jawa, tari Sunda, dan juga tari modern. Setiap jenis tari memiliki tingkat kesulitan yang berbeda sesuai kemampuan siswa."
        },
        {
            id: "4",
            question: "Kapan jadwal kelas tari?",
            answer: "Kelas tari kami diadakan setiap hari Minggu dari pukul 08:00 - 10:00. Untuk jadwal kelas tambahan atau kelas khusus, silakan hubungi kami untuk informasi lebih lanjut."
        },
        {
            id: "5",
            question: "Apakah perlu membawa kostum sendiri?",
            answer: "Untuk tahap awal pembelajaran, siswa cukup mengenakan pakaian yang nyaman untuk bergerak. Kostum tari akan disediakan khusus untuk penampilan atau event tertentu."
        }
    ];

    const faqItems = faqs.length > 0 ? faqs : defaultFaqs;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                    <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Kontak Kami
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    Ingin bergabung dengan kami atau memiliki pertanyaan? Jangan ragu untuk menghubungi kami! 
                    Kami siap membantu Anda memulai perjalanan seni tari yang menakjubkan.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Informasi Kontak */}
                <div className="space-y-6">
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                Informasi Kontak
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Alamat */}
                            <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold mb-2 text-foreground">Alamat</h3>
                                    <p className="text-muted-foreground leading-relaxed">{info.address}</p>
                                </div>
                            </div>

                            {/* Telepon & WhatsApp */}
                            <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h3 className="font-semibold mb-2 text-foreground">Telepon</h3>
                                        <Link
                                            href={`tel:${info.phone}`}
                                            className="text-muted-foreground hover:text-primary transition-colors font-medium block"
                                        >
                                            {info.phone}
                                        </Link>
                                    </div>
                                    {info.whatsapp && (
                                        <div>
                                            <h3 className="font-semibold mb-2 text-foreground">WhatsApp</h3>
                                            <Link
                                                href={`https://wa.me/${info.whatsapp.replace(/[^\d]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                                </svg>
                                                {info.whatsapp}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold mb-2 text-foreground">Email</h3>
                                    <Link
                                        href={`mailto:${info.email}`}
                                        className="text-muted-foreground hover:text-primary transition-colors font-medium"
                                    >
                                        {info.email}
                                    </Link>
                                </div>
                            </div>

                            {/* Jam Operasional */}
                            {info.operatingHours && (
                                <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-3 text-foreground">Jam Operasional</h3>
                                        <div className="space-y-2">
                                            {info.operatingHours.map((schedule: any, index: number) => (
                                                <div key={index} className="flex justify-between items-center p-2 bg-background rounded border">
                                                    <span className="text-muted-foreground font-medium">{schedule.days}</span>
                                                    <span className="font-semibold text-foreground">{schedule.hours}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Media Sosial */}
                    {info.socialMedia && (
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="text-xl">Ikuti Kami</CardTitle>
                                <p className="text-muted-foreground">Tetap terhubung dengan aktivitas terbaru kami</p>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {info.socialMedia.instagram && (
                                        <Link
                                            href={info.socialMedia.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:shadow-md transition-all group"
                                        >
                                            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 group-hover:scale-110 transition-transform">
                                                <Instagram className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">Instagram</div>
                                                <div className="text-sm text-muted-foreground">@sanggartari</div>
                                            </div>
                                        </Link>
                                    )}
                                    {info.socialMedia.tiktok && (
                                        <Link
                                            href={info.socialMedia.tiktok}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:shadow-md transition-all group"
                                        >
                                            <div className="p-2 rounded-lg bg-black group-hover:scale-110 transition-transform">
                                                <TikTokIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">TikTok</div>
                                                <div className="text-sm text-muted-foreground">@sanggartari</div>
                                            </div>
                                        </Link>
                                    )}
                                    {info.socialMedia.facebook && (
                                        <Link
                                            href={info.socialMedia.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:shadow-md transition-all group sm:col-span-3"
                                        >
                                            <div className="p-2 rounded-lg bg-blue-600 group-hover:scale-110 transition-transform">
                                                <Facebook className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">Facebook</div>
                                                <div className="text-sm text-muted-foreground">Sanggar Tari Ngesti Laras Budaya</div>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Form Kontak */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="text-xl">Kirim Pesan</CardTitle>
                        <p className="text-muted-foreground">
                            Isi form di bawah ini dan kami akan segera menghubungi Anda kembali.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <ContactForm />
                    </CardContent>
                </Card>
            </div>
            {/* Map Section */}
            <div className="my-12">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">Lokasi Kami</h2>
                    <p className="text-muted-foreground">
                        Temukan lokasi sanggar tari kami dan dapatkan petunjuk arah
                    </p>
                </div>
                <MapEmbed
                    address={info.alamat || info.address}
                    embedUrl={info.embed_map}
                />
            </div>

            {/* FAQ Section */}
            <div className="my-12">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">Pertanyaan yang Sering Diajukan</h2>
                    <p className="text-muted-foreground">
                        Temukan jawaban untuk pertanyaan umum tentang sanggar tari kami
                    </p>
                </div>
                <FaqSection
                    heading=""
                    description=""
                    items={faqItems}
                />
            </div>
        </div>
    );
}

export default ContactPage;