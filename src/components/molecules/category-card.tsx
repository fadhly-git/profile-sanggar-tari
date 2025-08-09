import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryCardProps {
    title: string
    description?: string
    children: React.ReactNode
    className?: string
}

export function CategoryCard({ title, description, children, className }: CategoryCardProps) {
    return (
        <Card className={className}>
            <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
                {description && (
                    <CardDescription className="text-sm">{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {children}
            </CardContent>
        </Card>
    )
}