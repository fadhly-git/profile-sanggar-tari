import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Copy, Download, ExternalLink, Eye, X } from "lucide-react";

export const DebugModal = ({ isOpen, onClose, data }: {
    isOpen: boolean;
    onClose: () => void;
    data: {
        status: number;
        headers: Record<string, string>;
        body: string;
        url: string;
    } | null;
}) => {
    const [activeTab, setActiveTab] = useState<'rendered' | 'source'>('source'); // Default ke source

    if (!isOpen || !data) return null;

    const isHtml = data.headers['content-type']?.includes('text/html');

    // Function untuk buka di tab baru yang lebih baik
    const openInNewTab = () => {
        try {
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                // Tulis HTML lengkap dengan proper doctype dan meta tags
                newWindow.document.open();

                // Cek apakah HTML sudah lengkap (ada <!DOCTYPE> atau <html>)
                const isCompleteHtml = data.body.toLowerCase().includes('<!doctype') ||
                    data.body.toLowerCase().includes('<html');

                if (isCompleteHtml) {
                    // HTML sudah lengkap, tulis langsung
                    newWindow.document.write(data.body);
                } else {
                    // HTML fragment, wrap dengan struktur lengkap
                    newWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <title>Server Error Response</title>
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <style>
                                body { 
                                    font-family: system-ui, -apple-system, sans-serif; 
                                    line-height: 1.5; 
                                    margin: 20px; 
                                }
                                pre { 
                                    background: #f5f5f5; 
                                    padding: 16px; 
                                    border-radius: 8px; 
                                    overflow: auto; 
                                }
                            </style>
                        </head>
                        <body>
                            ${data.body}
                        </body>
                        </html>
                    `);
                }

                newWindow.document.close();

                toast.success('Error page dibuka di tab baru');
            } else {
                toast.error('Popup diblokir browser. Silakan allow popup dan coba lagi.');
            }
        } catch (error) {
            console.error('Error opening new tab:', error);
            toast.error('Gagal membuka tab baru');
        }
    };

    // Extract key info from HTML
    const extractHtmlInfo = () => {
        const body = data.body;
        const titleMatch = body.match(/<title[^>]*>([^<]*)<\/title>/i);
        const h1Match = body.match(/<h1[^>]*>([^<]*)<\/h1>/i);
        const h2Match = body.match(/<h2[^>]*>([^<]*)<\/h2>/i);
        const errorKeywords = body.match(/(error|exception|traceback|stack trace|internal server error)/gi);

        return {
            title: titleMatch?.[1]?.trim(),
            heading: h1Match?.[1]?.trim() || h2Match?.[1]?.trim(),
            hasErrors: errorKeywords && errorKeywords.length > 0,
            errorTypes: errorKeywords ? [...new Set(errorKeywords)] : []
        };
    };

    const htmlInfo = isHtml ? extractHtmlInfo() : null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg w-full h-full max-w-7xl max-h-[90vh] flex flex-col border shadow-lg">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-destructive/10">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-destructive rounded-full"></div>
                        <div>
                            <h3 className="text-lg font-semibold text-destructive">
                                Upload Error - Status {data.status}
                            </h3>
                            <p className="text-sm text-muted-foreground font-mono break-all">
                                {data.url}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Quick Info untuk HTML */}
                {isHtml && htmlInfo && (
                    <div className="p-4 bg-muted/50 border-b">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Status:</span> {data.status}
                            </div>
                            {htmlInfo.title && (
                                <div>
                                    <span className="font-medium">Title:</span> {htmlInfo.title}
                                </div>
                            )}
                            {htmlInfo.heading && (
                                <div>
                                    <span className="font-medium">Heading:</span> {htmlInfo.heading}
                                </div>
                            )}
                            {htmlInfo.hasErrors && (
                                <div className="md:col-span-3">
                                    <span className="font-medium text-destructive">Error Types:</span>{' '}
                                    {htmlInfo.errorTypes.join(', ')}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tabs untuk HTML */}
                {isHtml && (
                    <div className="border-b">
                        <div className="flex">
                            <button
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'source'
                                        ? 'border-primary text-primary bg-background'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                                onClick={() => setActiveTab('source')}
                            >
                                <Copy className="w-4 h-4 inline mr-2" />
                                HTML Source
                            </button>
                            <button
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'rendered'
                                        ? 'border-primary text-primary bg-background'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                                onClick={() => setActiveTab('rendered')}
                            >
                                <Eye className="w-4 h-4 inline mr-2" />
                                Preview
                            </button>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-hidden">
                    {isHtml && activeTab === 'rendered' ? (
                        <div className="h-full p-6 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="text-6xl">🌐</div>
                            <div className="max-w-md space-y-4">
                                <h3 className="text-xl font-semibold">
                                    Server Error Page Preview
                                </h3>
                                <p className="text-muted-foreground">
                                    Klik tombol di bawah untuk membuka error page di tab baru.
                                    Tab baru akan menampilkan HTML response server dengan styling yang proper.
                                </p>

                                <div className="space-y-3">
                                    <Button
                                        onClick={openInNewTab}
                                        className="w-full"
                                        size="lg"
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Open in New Tab
                                    </Button>

                                    <p className="text-xs text-muted-foreground">
                                        Pastikan popup tidak diblokir browser
                                    </p>
                                </div>
                            </div>

                            {/* Alternative: Inline preview dengan sandbox */}
                            <div className="w-full max-w-2xl">
                                <details className="border rounded-lg">
                                    <summary className="p-3 cursor-pointer hover:bg-muted/50">
                                        <span className="text-sm font-medium">🔍 Inline Preview (Limited)</span>
                                    </summary>
                                    <div className="border-t">
                                        <iframe
                                            srcDoc={data.body}
                                            className="w-full h-64 border-0"
                                            sandbox="allow-same-origin"
                                            title="HTML Preview"
                                        />
                                    </div>
                                </details>
                            </div>
                        </div>
                    ) : (
                        // Raw source code
                        <div className="h-full overflow-auto">
                            <pre className="p-4 text-sm leading-relaxed whitespace-pre-wrap font-mono text-foreground">
                                {data.body}
                            </pre>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t bg-muted/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                            <strong>Content-Type:</strong> {data.headers['content-type'] || 'Unknown'}
                        </div>
                        <div>
                            <strong>Size:</strong> {(data.body.length / 1024).toFixed(1)}KB
                        </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                navigator.clipboard.writeText(data.body);
                                toast.success('Response copied to clipboard');
                            }}
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const blob = new Blob([data.body], {
                                    type: isHtml ? 'text/html' : 'text/plain'
                                });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `error-${data.status}-${Date.now()}.${isHtml ? 'html' : 'txt'}`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                                toast.success('File downloaded');
                            }}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>

                        {isHtml && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={openInNewTab}
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                New Tab
                            </Button>
                        )}

                        <Button
                            onClick={onClose}
                            variant="default"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};