import { Poppins } from 'next/font/google'
import '@/app/admin/admin.css'
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollAreaProvider } from '@/context/scrollarea-context'
import { Toaster } from '@/components/ui/sonner'
import ErrorBoundary from '@/components/molecules/error-boundary'
import { Metadata } from 'next'
import { PublicLayout } from '@/components/layout/public-layout'

const poppins = Poppins({ subsets: ['latin'], weight: ['500', '800'] })

export const metadata: Metadata = {
    title: "Website - Platform Informasi Terpercaya",
    description: "Platform informasi terpercaya yang menyajikan berita terkini, artikel berkualitas, dan galeri foto untuk memberikan wawasan yang bermanfaat bagi masyarakat.",
    keywords: ["berita", "artikel", "informasi", "galeri", "website"],
    authors: [{ name: "Website Team" }],
    creator: "Website",
    publisher: "Website",
    openGraph: {
        type: "website",
        locale: "id_ID",
        url: "https://website.com",
        title: "Website - Platform Informasi Terpercaya",
        description: "Platform informasi terpercaya yang menyajikan berita terkini, artikel berkualitas, dan galeri foto untuk memberikan wawasan yang bermanfaat bagi masyarakat.",
        siteName: "Website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Website - Platform Informasi Terpercaya",
        description: "Platform informasi terpercaya yang menyajikan berita terkini, artikel berkualitas, dan galeri foto untuk memberikan wawasan yang bermanfaat bagi masyarakat.",
        creator: "@website",
    },
};

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Toaster position="top-center" />
            <ScrollAreaProvider>
                <ErrorBoundary>
                    <PublicLayout>
                        {children}
                    </PublicLayout>
                </ErrorBoundary>
            </ScrollAreaProvider>
        </ThemeProvider>
    );
}
