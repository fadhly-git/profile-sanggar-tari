import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface QuickTipsProps {
    tips: string[];
    title?: string;
}

export function QuickTips({ tips, title = "Tips" }: QuickTipsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                    {tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                            <p className="text-xs">{tip}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}