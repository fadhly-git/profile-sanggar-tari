// @/components/molecules/mission-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconResolver, IconType } from "@/lib/utils/icon-resolver";

interface MissionCardProps {
    title: string;
    description: string;
    icon: IconType;
    className?: string;
}

export function MissionCard({ title, description, icon, className = "" }: MissionCardProps) {
    return (
        <Card className={`hover:shadow-lg transition-all duration-300 group ${className}`}>
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <IconResolver
                            icon={icon}
                            className="h-6 w-6 text-primary"
                            size={32}
                        />
                    </div>
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground leading-relaxed text-base text-pretty text-justify">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}