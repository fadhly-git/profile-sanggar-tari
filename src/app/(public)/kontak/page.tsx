/* eslint-disable @typescript-eslint/no-explicit-any */
// @/app/(public)/kontak/page.tsx
import { Metadata } from "next";
import { getPageContentByKey } from "@/lib/actions/page-content-actions";
import { getActiveFaqs } from "@/lib/actions/faq-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, MessageSquare, Facebook, Instagram } from "lucide-react";
import ContactForm from "./contact-form";
import { Separator } from "@/components/ui/separator";
import { TikTokIcon } from "@/components/atoms/d";
import { MapEmbed } from "@/components/molecules/map-embed";
import { FaqSection } from "@/components/molecules/faq-section";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Kontak Kami - Sanggar Tari Ngesti Laras Budaya",
    description: "Hubungi kami untuk informasi lebih lanjut tentang kelas tari, jadwal, dan pendaftaran di Sanggar Tari Ngesti Laras Budaya.",
    keywords: "kontak sanggar tari ngesti laras budaya, hubungi kami, alamat sanggar tari ngesti laras budaya, telepon sanggar tari ngesti laras budaya, email sanggar tari, informasi sanggar tari",
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
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Kontak Kami</h1>
                <p className="text-base text-muted-foreground max-w-5xl mx-auto">
                    Ingin bergabung dengan kami atau memiliki pertanyaan? Jangan ragu untuk menghubungi kami!
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Informasi Kontak */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Informasi Kontak
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Alamat */}
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold mb-1">Alamat</h3>
                                    <p className="text-muted-foreground">{info.address}</p>
                                </div>
                            </div>

                            <Separator />

                            {/* Telepon & WhatsApp */}
                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                <div className="space-y-2">
                                    <div>
                                        <h3 className="font-semibold mb-1">Telepon</h3>
                                        <Link
                                            href={`tel:${info.phone}`}
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {info.phone}
                                        </Link>
                                    </div>
                                    {info.whatsapp && (
                                        <div>
                                            <h3 className="font-semibold mb-1">WhatsApp</h3>
                                            <Link
                                                href={`https://wa.me/${info.whatsapp.replace(/[^\d]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {info.whatsapp}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Email */}
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold mb-1">Email</h3>
                                    <Link
                                        href={`mailto:${info.email}`}
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {info.email}
                                    </Link>
                                </div>
                            </div>

                            {/* Jam Operasional */}
                            {info.operatingHours && (
                                <>
                                    <Separator />
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                        <div className="space-y-2">
                                            <h3 className="font-semibold mb-2">Jam Operasional</h3>
                                            {info.operatingHours.map((schedule: any, index: number) => (
                                                <div key={index} className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">{schedule.days}</span>
                                                    <span className="font-medium">{schedule.hours}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Media Sosial */}
                    {info.socialMedia && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Ikuti Kami</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    {info.socialMedia.instagram && (
                                        <Link
                                            href={info.socialMedia.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-lg"><Instagram className="w-4 h-4 text-white" /></span> Instagram
                                        </Link>
                                    )}
                                    {info.socialMedia.tiktok && (
                                        <Link
                                            href={info.socialMedia.tiktok}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <span className="bg-black p-1 rounded-lg"><TikTokIcon className="w-4 h-4" /></span> TikTok
                                        </Link>
                                    )}
                                    {info.socialMedia.facebook && (
                                        <Link
                                            href={info.socialMedia.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <span className="bg-blue-600 p-1 rounded-lg text-white"><Facebook className="w-4 h-4" /></span> Facebook
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Form Kontak */}
                <Card>
                    <CardHeader>
                        <CardTitle>Kirim Pesan</CardTitle>
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
            <div className="my-8">
                <MapEmbed
                    address={info.alamat || info.address}
                    embedUrl={info.embed_map}
                />
            </div>

            {/* FAQ Section */}
            <FaqSection
                heading="Pertanyaan yang Sering Diajukan"
                description="Temukan jawaban untuk pertanyaan umum tentang sanggar tari kami"
                items={faqItems}
            />
        </div>
    );
}

export default ContactPage;