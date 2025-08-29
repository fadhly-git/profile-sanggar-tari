// @/components/layouts/public-layout.tsx
import { Header } from "@/components/molecules/main-navigation";
import { Footer } from "@/components/molecules/main-footer";
import { PublicScrollArea } from "@/components/public-scroll-area";
import ScrollToTop from "@/components/atoms/scroll-to-top";

interface PublicLayoutProps {
    children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col overflow-hidden">
            <PublicScrollArea bottomSpacing="none">
                <Header />
                <main className="flex-grow">
                    {children}
                    <ScrollToTop />
                </main>
                <Footer />
            </PublicScrollArea>
        </div>
    );
}