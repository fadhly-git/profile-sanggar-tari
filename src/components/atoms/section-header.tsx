// @/components/atoms/section-header.tsx
interface SectionHeaderProps {
    title: string
    subtitle?: string
    centered?: boolean
    className?: string
}

export default function SectionHeader({
    title,
    subtitle,
    centered = false,
    className = ""
}: SectionHeaderProps) {
    return (
        <div className={`space-y-2 ${centered ? 'text-center' : ''} ${className}`}>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {subtitle && (
                <p className="text-muted-foreground text-lg">{subtitle}</p>
            )}
        </div>
    )
}