// @/components/metadata-viewer.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MetadataViewerProps {
    metadata: string | null;
    className?: string;
}

export function MetadataViewer({ metadata, className = '' }: MetadataViewerProps) {
    if (!metadata) {
        return null;
    }

    let parsedMetadata: Record<string, any> = {};

    try {
        parsedMetadata = JSON.parse(metadata);
    } catch {
        // Jika bukan JSON, tampilkan sebagai text biasa
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="text-sm">Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {metadata}
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (Object.keys(parsedMetadata).length === 0) {
        return null;
    }

    const renderValue = (value: any): React.ReactNode => {
        if (typeof value === 'boolean') {
            return (
                <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Ya' : 'Tidak'}
                </Badge>
            );
        }

        if (typeof value === 'object' && value !== null) {
            return (
                <pre className="text-xs bg-muted p-2 rounded whitespace-pre-wrap">
                    {JSON.stringify(value, null, 2)}
                </pre>
            );
        }

        if (Array.isArray(value)) {
            return (
                <div className="flex flex-wrap gap-1">
                    {value.map((item, index) => (
                        <Badge key={index} variant="outline">
                            {String(item)}
                        </Badge>
                    ))}
                </div>
            );
        }

        return <span className="text-sm">{String(value)}</span>;
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-sm">Informasi Tambahan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {Object.entries(parsedMetadata).map(([key, value]) => (
                    <div key={key} className="flex flex-col space-y-1">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {key.replace(/_/g, ' ')}
                        </label>
                        {renderValue(value)}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}