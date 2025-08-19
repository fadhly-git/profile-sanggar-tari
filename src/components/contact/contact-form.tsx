// components/contact/contact-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { createContact } from "@/lib/actions/contact-actions";

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const result = await createContact(formData);

            if (result.success) {
                setIsSuccess(true);
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                setError(result.error || "Failed to send message");
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Ganti bagian if (isSuccess) dengan kode ini:
    if (isSuccess) {
        return (
            <Card className="max-w-md mx-auto">
                <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                        <h3 className="text-xl font-semibold text-green-700">
                            Pesan Berhasil Dikirim! ✉️
                        </h3>
                        <div className="space-y-2 text-gray-600">
                            <p>
                                Terima kasih telah menghubungi kami. Kami telah menerima pesan Anda.
                            </p>
                            <p className="text-sm">
                                📧 Email konfirmasi telah dikirim ke inbox Anda
                            </p>
                            <p className="text-sm font-medium">
                                Tim kami akan merespons dalam 1x24 jam
                            </p>
                        </div>
                        <Button
                            onClick={() => setIsSuccess(false)}
                            variant="outline"
                            className="w-full"
                        >
                            Kirim Pesan Lain
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    Hubungi Kami 📞
                </CardTitle>
                <p className="text-center text-gray-600">
                    Kami ingin mendengar dari Anda. Kirimkan pesan dan kami akan merespons secepat mungkin.
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nama lengkap Anda"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="email.anda@example.com"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                            id="subject"
                            name="subject"
                            type="text"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Apa yang ingin Anda sampaikan?"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                            id="message"
                            name="message"
                            required
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Beritahu kami lebih lanjut tentang pertanyaan Anda..."
                            className="min-h-[120px]"
                            disabled={isSubmitting}
                        />
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                        size="lg"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Mengirim...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Kirim Pesan
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}