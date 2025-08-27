// @/components/layouts/public-layout.tsx
import { Header } from "@/components/molecules/main-navigation";
import { Footer } from "@/components/molecules/main-footer";
import { PublicScrollArea } from "../public-scroll-area";

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
                </main>
                <Footer />
            </PublicScrollArea>
        </div>
    );
}