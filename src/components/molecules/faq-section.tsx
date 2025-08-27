// @/components/molecules/faq-section.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

interface FaqProps {
    heading: string;
    description: string;
    items?: FaqItem[];
}

export function FaqSection({ heading, description, items = [] }: FaqProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    {heading}
                </CardTitle>
                <CardDescription className="text-muted-foreground">{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                    {items.map((item) => (
                        <AccordionItem
                            key={item.id}
                            value={item.id}
                            className="border rounded-lg px-4"
                        >
                            <AccordionTrigger className="text-left hover:no-underline py-4">
                                <span className="font-medium">{item.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 text-muted-foreground">
                                <div className="prose prose-sm max-w-none">
                                    {item.answer.split('\n\n').map((paragraph, index) => (
                                        <p key={index} className="mb-2 last:mb-0">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}