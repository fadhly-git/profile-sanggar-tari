/* eslint-disable @typescript-eslint/no-explicit-any */
// components/metadata-display.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MetadataDisplayProps {
    metadata: string | object
    title?: string
}

export function MetadataDisplay({ metadata, title = "Metadata" }: MetadataDisplayProps) {
    let parsedMetadata: any = {}

    try {
        parsedMetadata = typeof metadata === 'string' ? JSON.parse(metadata) : metadata
    } catch {
        parsedMetadata = { raw: metadata }
    }

    const renderValue = (value: any): React.ReactNode => {
        if (value === null || value === undefined) {
            return <span className="text-muted-foreground">-</span>
        }

        if (typeof value === 'boolean') {
            return <Badge variant={value ? "default" : "secondary"}>{value.toString()}</Badge>
        }

        if (Array.isArray(value)) {
            return (
                <div className="flex flex-wrap gap-1">
                    {value.map((item, index) => (
                        <Badge key={index} variant="outline">{String(item)}</Badge>
                    ))}
                </div>
            )
        }

        if (typeof value === 'object') {
            return (
                <div className="pl-4 border-l-2 border-muted">
                    {Object.entries(value).map(([key, val]) => (
                        <div key={key} className="mb-2">
                            <span className="font-medium text-sm">{key}:</span>
                            <div className="ml-2">{renderValue(val)}</div>
                        </div>
                    ))}
                </div>
            )
        }

        return <span>{String(value)}</span>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {Object.keys(parsedMetadata).length === 0 ? (
                    <p className="text-muted-foreground">No metadata available</p>
                ) : (
                    <div className="space-y-3">
                        {Object.entries(parsedMetadata).map(([key, value]) => (
                            <div key={key}>
                                <div className="font-medium text-sm mb-1 capitalize">
                                    {key.replace(/([A-Z])/g, ' \$1').replace(/^./, str => str.toUpperCase())}:
                                </div>
                                <div className="ml-2">{renderValue(value)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}