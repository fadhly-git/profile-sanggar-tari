/* eslint-disable @typescript-eslint/no-explicit-any */
// @/lib/utils/icon-resolver.tsx
import { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

// Type untuk icon yang bisa berupa string nama icon atau URL
export type IconType = string | ReactNode;

interface IconResolverProps {
    icon: IconType;
    className?: string;
    size?: number;
}

export function IconResolver({ icon, className = "h-6 w-6", size }: IconResolverProps) {
    // Jika icon adalah ReactNode (sudah berupa komponen)
    if (typeof icon !== 'string') {
        return <span className={className}>{icon}</span>;
    }

    // Jika icon adalah URL gambar
    if (icon.startsWith('http') || icon.startsWith('/')) {
        return (
            <Image
                width={size || 24}
                height={size || 24}
                src={icon}
                alt="Icon"
                className={className}
                style={{ width: size, height: size }}
            />
        );
    }

    // Jika icon adalah nama dari Lucide React
    try {
        // Konversi nama icon ke PascalCase (misal: square-kanban -> SquareKanban)
        const iconName = icon
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');

        const LucideIcon = (LucideIcons as any)[iconName] as LucideIcon;

        if (LucideIcon) {
            return <LucideIcon className={className} size={size} />;
        }
    } catch (error) {
        console.warn(`Icon "${icon}" tidak ditemukan di Lucide React`);
        console.error(error);
    }

    // Fallback jika icon tidak ditemukan - tampilkan emoji atau icon default
    if (icon.length <= 2) {
        // Anggap sebagai emoji
        return <span className={className}>{icon}</span>;
    }

    // Default fallback icon
    const DefaultIcon = LucideIcons.HelpCircle;
    return <DefaultIcon className={className} size={size} />;
}

// Helper function untuk mengambil icon berdasarkan string
export function getIconByName(iconName: string): LucideIcon | null {
    try {
        const formattedName = iconName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');

        return (LucideIcons as any)[formattedName] as LucideIcon || null;
    } catch {
        return null;
    }
}