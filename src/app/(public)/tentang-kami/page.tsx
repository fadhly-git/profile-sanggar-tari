/* eslint-disable @typescript-eslint/no-explicit-any */
// @/app/(public)/tentang-kami/page.tsx
import { Metadata } from "next";
import { getPageContentWithParsedMetadata } from "@/lib/actions/page-content-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building, Lightbulb, Map } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { MissionCard } from "@/components/molecules/mission-card";
import Link from "next/link";
import { getAllSettings } from "@/lib/actions/setting-actions";

// Ubah dari static metadata menjadi dynamic generateMetadata function
export async function generateMetadata(): Promise<Metadata> {
    // Ambil data dari database
    const settingsResult = await getAllSettings();
    const aboutResult = await getPageContentWithParsedMetadata("about_us");
    const pageMetaResult = await getPageContentWithParsedMetadata("tentang_kami_meta");

    // Extract data dengan fallback
    const settings: { site_name?: string; site_description?: string;[key: string]: any } =
        settingsResult.success && settingsResult.data ? settingsResult.data : {};

    const aboutData = aboutResult.success && aboutResult.data ? aboutResult.data : null;
    const pageMetaData = pageMetaResult.success && pageMetaResult.data ? pageMetaResult.data : null;

    // Ambil metadata dari database atau gunakan default
    const pageTitle = pageMetaData?.title || `Tentang Kami | ${settings.site_name || 'Sanggar Tari Ngesti Laras Budaya'}`;
    const pageDescription = pageMetaData?.parsedMetadata?.description ||
        aboutData?.parsedMetadata?.description ||
        "Mengenal lebih dekat Sanggar Tari Ngesti Laras Budaya, sejarah, visi misi, dan komitmen kami dalam melestarikan seni tari tradisional dan modern di Boja, Meteseh Boja, Kab. Kendal sejak 2023.";

    const pageKeywords = pageMetaData?.parsedMetadata?.keywords ||
        "sanggar tari, ngesti laras budaya, boja, meteseh boja, Kab. Kendal, seni tari, budaya, tentang kami, sejarah sanggar, visi misi";

    const ogImage = pageMetaData?.parsedMetadata?.og_image ||
        aboutData?.parsedMetadata?.image ||
        `${process.env.NEXT_PUBLIC_APP_URL}/og-tentang-kami.jpg`;

    const foundedYear = aboutData?.parsedMetadata?.founded_year || "2023";

    return {
        title: pageTitle,
        description: pageDescription,
        keywords: pageKeywords,

        openGraph: {
            title: pageTitle,
            description: pageDescription,
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ngelaras.my.id'}/tentang-kami`,
            siteName: settings.site_name || "Sanggar Tari Ngesti Laras Budaya",
            locale: "id_ID",
            type: "website",
            images: [{
                url: ogImage,
                width: 1200,
                height: 630,
                alt: `Tentang ${settings.site_name || 'Sanggar Tari Ngesti Laras Budaya'} | Berdiri sejak ${foundedYear}`
            }]
        },

        twitter: {
            card: 'summary_large_image',
            title: pageTitle,
            description: pageDescription,
            images: [ogImage]
        },

        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ngelaras.my.id'}/tentang-kami`,
        },

        robots: pageMetaData?.parsedMetadata?.robots || 'index, follow',
        authors: [{
            name: pageMetaData?.parsedMetadata?.author ||
                aboutData?.parsedMetadata?.author ||
                'Sanggar Tari Ngesti Laras Budaya'
        }],

        // Local Business Schema
        other: {
            'geo.region': 'ID-JT',
            'geo.placename': 'Kendal',
            'geo.position': '-6.9175;110.2425',
            'article:section': 'Tentang Kami',
            'article:tag': pageKeywords
        }
    };
}

async function AboutPage() {
    // Ambil konten dari database
    const aboutResult = await getPageContentWithParsedMetadata("about_us");
    const visionResult = await getPageContentWithParsedMetadata("vision");
    const missionResult = await getPageContentWithParsedMetadata("mission");
    const historyResult = await getPageContentWithParsedMetadata("history");

    // Default content jika tidak ada di database
    const defaultContent = {
        about: {
            title: "Tentang Kami",
            content: `Sanggar Tari Ngesti Laras Budaya adalah tempat pembelajaran seni tari tradisional dan modern yang telah berdiri sejak tahun 2023. Kami berkomitmen untuk melestarikan budaya Indonesia sambil mengembangkan kreativitas anak-anak melalui seni tari.

Berlokasi di Boja, Meteseh Boja, Kabupaten Kendal, kami hadir sebagai wadah bagi para pecinta seni tari untuk belajar, berkembang, dan mengekspresikan kreativitas mereka.

Dengan pengalaman dan dedikasi tinggi, kami telah melatih banyak penari berbakat yang kemudian menjadi bagian penting dalam pelestarian budaya Indonesia.`
        },
        history: {
            title: "Sejarah Berdiri",
            content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta iusto perferendis doloribus sunt. Obcaecati quidem sequi, et distinctio, consequuntur aliquam blanditiis laudantium quos optio laboriosam omnis quia magnam, explicabo ipsum!

Perjalanan kami dimulai dari kecintaan terhadap seni budaya Indonesia. Dengan tekad kuat untuk melestarikan warisan nenek moyang, kami mulai mengajarkan tari tradisional kepada anak-anak di sekitar lingkungan.

Seiring berjalannya waktu, antusiasme masyarakat semakin tinggi dan kami pun berkembang menjadi sanggar tari yang dikenal luas di wilayah Kendal dan sekitarnya.`
        },
        vision: {
            title: "Visi",
            content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta iusto perferendis doloribus sunt. Obcaecati quidem sequi, et distinctio, consequuntur aliquam blanditiis laudantium quos optio laboriosam omnis quia magnam, explicabo ipsum!"
        },
        missions: [
            {
                title: "Experience",
                description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe est aliquid exercitationem, quos explicabo repellat?",
                icon: "square-kanban"
            },
            {
                title: "Pelestarian Budaya",
                description: "Melestarikan warisan seni tari tradisional Indonesia untuk generasi mendatang dengan pendekatan yang autentik namun mudah dipahami.",
                icon: "🏛️"
            },
            {
                title: "Pendidikan Berkualitas",
                description: "Memberikan pendidikan tari yang berkualitas dengan metode pembelajaran yang efektif dan menyenangkan bagi semua usia.",
                icon: "graduation-cap"
            },
            {
                title: "Pengembangan Kreativitas",
                description: "Mengembangkan kreativitas dan bakat setiap siswa dalam seni tari melalui eksplorasi gerakan yang inovatif.",
                icon: "palette"
            },
            {
                title: "Komunitas Positif",
                description: "Membangun komunitas yang positif dan supportif bagi para pecinta seni tari dari berbagai latar belakang.",
                icon: "users"
            }
        ]
    };

    // Gunakan data dari database jika ada, jika tidak gunakan default
    const aboutContent = aboutResult.success && aboutResult.data
        ? { title: aboutResult.data.title, content: aboutResult.data.content }
        : defaultContent.about;

    const historyContent = historyResult.success && historyResult.data
        ? { title: historyResult.data.title, content: historyResult.data.content }
        : defaultContent.history;

    const visionContent = visionResult.success && visionResult.data
        ? { title: visionResult.data.title, content: visionResult.data.content }
        : defaultContent.vision;

    // Parse mission data jika ada
    let missionData = defaultContent.missions;
    if (missionResult.success && missionResult.data?.parsedMetadata?.missions) {
        missionData = missionResult.data.parsedMetadata.missions;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Tentang Kami</h1>
                <p className="text-lg text-muted-foreground max-w-5xl text-pretty mx-auto">
                    Mengenal lebih dekat Sanggar Tari Ngesti Laras Budaya dan komitmen kami dalam melestarikan seni budaya Indonesia
                </p>
            </div>

            <div className="space-y-16">
                {/* About Section */}
                <section>
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Building className="h-8 w-8 text-primary" />
                                <h2 className="text-3xl font-bold">{aboutContent.title}</h2>
                            </div>
                            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                                {aboutContent.content.split('\n\n').map((paragraph: string, index: number) => (
                                    <div key={index} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: paragraph }} />
                                ))}
                            </div>

                            {/* Highlight Badge */}
                            <div className="mt-6">
                                <Badge variant="secondary" className="px-4 py-2">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Berdiri sejak {aboutResult.data?.parsedMetadata?.founded_year || "2023"}
                                </Badge>
                            </div>
                        </div>
                        <div className="relative h-96 rounded-lg overflow-hidden items-center flex justify-center">
                            <Image
                                src={`${aboutResult.data?.parsedMetadata?.image || 'logo.png'}`}
                                alt="Sanggar Tari Ngesti Laras Budaya"
                                height={400}
                                width={400}
                                style={{ height: 'auto', width: 'auto', maxHeight: '100%', maxWidth: '100%' }}
                                className="object-cover rounded-2xl"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    </div>
                </section>

                <Separator />

                {/* History Section */}
                <section>
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div className="relative h-96 rounded-lg overflow-hidden">
                            <Image
                                src={`${historyResult.data?.parsedMetadata?.image || 'logo.png'}`}
                                alt="Sejarah Sanggar Tari"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Calendar className="h-8 w-8 text-primary" />
                                <h2 className="text-3xl font-bold">{historyContent.title}</h2>
                            </div>
                            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                                {historyContent.content.split('\n\n').map((paragraph: string, index: number) => (
                                    <div key={index} className="leading-relaxed prose ProseMirror" dangerouslySetInnerHTML={{ __html: paragraph }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Vision Section */}
                <section>
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-2 rounded-full bg-primary/10 border-2 border-primary/20">
                                    <Lightbulb className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl">{visionContent.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-base text-center text-pretty text-muted-foreground max-w-5xl mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: visionContent.content }} />
                        </CardContent>
                    </Card>
                </section>

                {/* Mission Section */}
                <section>
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-4">
                            <div className="p-2 rounded-full bg-primary/10 border-2 border-primary/20">
                                <Map className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Misi Kami</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Langkah-langkah konkret yang kami lakukan untuk mewujudkan visi kami
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {missionData.map((mission: any, index: number) => {

                            return (
                                <MissionCard
                                    key={index}
                                    title={mission.title}
                                    description={mission.description}
                                    icon={mission.image}
                                />
                            )
                        })}
                    </div>
                </section>

                <Separator />

                {/* Call to Action */}
                <section className="text-center">
                    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                        <CardContent className="p-8">
                            <h3 className="text-2xl font-bold mb-4">
                                Bergabunglah dengan Kami!
                            </h3>
                            <p className="text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
                                Wujudkan mimpi Anda menjadi penari yang berbakat sambil melestarikan budaya Indonesia bersama Sanggar Tari Ngesti Laras Budaya.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/kontak"
                                    className="inline-flex items-center justify-center px-4 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                                >
                                    Hubungi Kami
                                </Link>
                                <Link
                                    href="/galeri"
                                    className="inline-flex items-center justify-center px-4 py-1 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
                                >
                                    Lihat Galeri
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}

export default AboutPage;