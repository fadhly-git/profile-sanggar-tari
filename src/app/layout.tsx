import { Poppins } from 'next/font/google'
import '@/app/admin/admin.css'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from '@/components/ui/sonner'
import ErrorBoundary from '@/components/molecules/error-boundary'

const poppins = Poppins({ subsets: ['latin'], weight: ['500', '800'] })


export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.className} antialiased overflow-hidden w-full h-full`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Toaster position="top-center" />
                        <ErrorBoundary>
                            {children}
                        </ErrorBoundary>
                </ThemeProvider>
            </body>
        </html>
    );
}
