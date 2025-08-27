
import { ThemeProvider } from "@/components/theme-provider"
import { PublicLayout } from '@/components/layout/public-layout'

export default async function PublicLayoutWrapper({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light" // Ubah ke light untuk public
            enableSystem
            disableTransitionOnChange
        >
            <PublicLayout>
                {children}
            </PublicLayout>
        </ThemeProvider>
    );
}