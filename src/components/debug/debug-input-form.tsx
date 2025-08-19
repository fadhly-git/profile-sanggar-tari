"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { DebugModal } from "./debug-modal";
import { Play, FileText, Code } from "lucide-react";

export function DebugInputForm() {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        status: "200",
        contentType: "text/html",
        url: "/api/debug",
        body: ""
    });

    // Template HTML untuk quick start
    const htmlTemplates = {
        error: `<!DOCTYPE html>
<html>
<head>
    <title>Internal Server Error</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .error { color: #d32f2f; background: #ffebee; padding: 20px; border-radius: 8px; }
        .stack { background: #f5f5f5; padding: 15px; margin-top: 20px; font-family: monospace; }
    </style>
</head>
<body>
    <h1>500 - Internal Server Error</h1>
    <div class="error">
        <h2>Something went wrong!</h2>
        <p>The server encountered an internal error and was unable to complete your request.</p>
    </div>
    <div class="stack">
        <h3>Error Details:</h3>
        <pre>
TypeError: Cannot read property 'id' of undefined
    at getUserById (/app/controllers/user.js:25:18)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
        </pre>
    </div>
</body>
</html>`,
        
        laravel: `<!DOCTYPE html>
<html class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Server Error</title>
    <style>
        body { font-family: ui-sans-serif, system-ui; margin: 0; background: #ef4444; color: white; }
        .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
        .error-code { font-size: 6rem; font-weight: bold; opacity: 0.8; }
        .error-message { font-size: 1.5rem; margin: 1rem 0; }
        .stack-trace { background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.9rem; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-code">500</div>
        <div class="error-message">Whoops, looks like something went wrong.</div>
        <div class="stack-trace">
Illuminate\\Database\\QueryException: SQLSTATE[42S02]: Base table or view not found: 1146 Table 'myapp.users' doesn't exist (SQL: select * from \`users\` where \`email\` = user@example.com limit 1) in /var/www/html/vendor/laravel/framework/src/Illuminate/Database/Connection.php:712

Stack trace:
#0 /var/www/html/vendor/laravel/framework/src/Illuminate/Database/Connection.php(672): Illuminate\\Database\\Connection->runQueryCallback()
#1 /var/www/html/vendor/laravel/framework/src/Illuminate/Database/Connection.php(628): Illuminate\\Database\\Connection->run()
#2 /var/www/html/app/Http/Controllers/UserController.php(24): Illuminate\\Database\\Connection->select()
        </div>
    </div>
</body>
</html>`,
        
        json: `{
  "error": {
    "type": "ValidationError",
    "message": "The given data was invalid.",
    "details": {
      "email": [
        "The email field is required."
      ],
      "password": [
        "The password field is required."
      ]
    }
  },
  "status": 422,
  "timestamp": "2024-08-18T07:31:00Z"
}`,
        
        plain: `Error: Database connection failed

Unable to connect to MySQL server at localhost:3306
Connection refused (Connection refused)

Please check:
1. MySQL server is running
2. Connection credentials are correct
3. Network connectivity is available

Stack trace:
  at Database.connect (/app/lib/database.js:45:12)
  at UserService.findById (/app/services/user.js:15:8)
  at async UserController.getUser (/app/controllers/user.js:28:20)`
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowModal(true);
    };

    const loadTemplate = (template: keyof typeof htmlTemplates) => {
        const templateData = htmlTemplates[template];
        setFormData(prev => ({
            ...prev,
            body: templateData,
            contentType: template === 'json' ? 'application/json' : 
                        template === 'plain' ? 'text/plain' : 'text/html'
        }));
    };

    const debugData = {
        status: parseInt(formData.status),
        headers: {
            'content-type': formData.contentType
        },
        body: formData.body,
        url: formData.url
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code className="w-5 h-5" />
                            Debug Response Tester
                        </CardTitle>
                        <CardDescription>
                            Input response data untuk testing dan debugging. Anda bisa input HTML, JSON, atau plain text.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Quick Templates */}
                        <div>
                            <Label className="text-sm font-medium mb-3 block">Quick Templates:</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => loadTemplate('error')}
                                    className="justify-start"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    HTML Error
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => loadTemplate('laravel')}
                                    className="justify-start"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Laravel Error
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => loadTemplate('json')}
                                    className="justify-start"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    JSON Error
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => loadTemplate('plain')}
                                    className="justify-start"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Plain Text
                                </Button>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                            onKeyDown={(e) => {
                                if (e.ctrlKey && e.key === "Enter") {
                                    handleSubmit(e);
                                }
                            }}
                        >
                            {/* Response Settings */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="status">HTTP Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="200">200 - OK</SelectItem>
                                            <SelectItem value="400">400 - Bad Request</SelectItem>
                                            <SelectItem value="401">401 - Unauthorized</SelectItem>
                                            <SelectItem value="403">403 - Forbidden</SelectItem>
                                            <SelectItem value="404">404 - Not Found</SelectItem>
                                            <SelectItem value="422">422 - Unprocessable Entity</SelectItem>
                                            <SelectItem value="500">500 - Internal Server Error</SelectItem>
                                            <SelectItem value="502">502 - Bad Gateway</SelectItem>
                                            <SelectItem value="503">503 - Service Unavailable</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="contentType">Content Type</Label>
                                    <Select
                                        value={formData.contentType}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text/html">text/html</SelectItem>
                                            <SelectItem value="application/json">application/json</SelectItem>
                                            <SelectItem value="text/plain">text/plain</SelectItem>
                                            <SelectItem value="text/xml">text/xml</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="url">URL</Label>
                                    <Input
                                        id="url"
                                        value={formData.url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                                        placeholder="/api/endpoint"
                                    />
                                </div>
                            </div>

                            {/* Response Body */}
                            <div>
                                <Label htmlFor="body">Response Body</Label>
                                <Textarea
                                    id="body"
                                    value={formData.body}
                                    onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                                    placeholder="Paste your HTML, JSON, or text response here..."
                                    className="min-h-[300px] font-mono text-sm"
                                />
                                <div className="text-xs text-muted-foreground mt-1">
                                    {formData.body.length} characters • {(formData.body.length / 1024).toFixed(1)}KB
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full md:w-auto"
                                disabled={!formData.body.trim()}
                            >
                                <Play className="w-4 h-4 mr-2" />
                                Preview Response
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Debug Modal */}
            <DebugModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                data={debugData}
            />
        </>
    );
}