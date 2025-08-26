// @/components/molecules/map-embed.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapEmbedProps {
    address: string;
    embedUrl?: string;
    googleMapsUrl?: string;
    className?: string;
}

export function MapEmbed({
    address,
    embedUrl,
    googleMapsUrl,
    className = ""
}: MapEmbedProps) {
    // Default embed URL jika tidak disediakan
    const defaultEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15864.874419287634!2d110.1994!3d-7.0051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b4c3b3b3b3b%3A0x1!2sBoja%2C+Kendal+Regency%2C+Central+Java!5e0!3m2!1sen!2sid!4v1";

    const mapUrl = embedUrl || defaultEmbedUrl;
    const directionsUrl = googleMapsUrl || `https://www.google.com/maps/search/${encodeURIComponent(address)}`;

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Lokasi Kami
                </CardTitle>
                <p className="text-muted-foreground">{address}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Map Container */}
                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                    <iframe
                        src={mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Peta lokasi ${address}`}
                        className="absolute inset-0"
                    />
                </div>

                {/* Directions Button */}
                <Button
                    variant="outline"
                    className="w-full"
                    asChild
                >
                    <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Buka di Google Maps
                    </a>
                </Button>
            </CardContent>
        </Card>
    );
}