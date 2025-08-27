// @/app/(public)/kontak/contact-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { createContact } from "@/lib/actions/contact-actions";
import { CheckCircle, AlertCircle } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Format email tidak valid").max(255, "Email terlalu panjang"),
  subject: z.string().min(5, "Subjek minimal 5 karakter").max(200, "Subjek maksimal 200 karakter"),
  message: z.string().min(10, "Pesan minimal 10 karakter").max(1000, "Pesan maksimal 1000 karakter"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const result = await createContact(data);
      
      if (result.success) {
        setSubmitResult({
          success: true,
          message: result.message || "Pesan berhasil dikirim!"
        });
        reset();
      } else {
        setSubmitResult({
          success: false,
          message: result.error || "Gagal mengirim pesan"
        });
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "Terjadi kesalahan. Silakan coba lagi."
      });
        console.error("Error submitting contact form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Alert untuk result */}
      {submitResult && (
        <Alert className={submitResult.success ? "border-green-500 bg-background/60" : "border-red-500 bg-background/60"}>
          {submitResult.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={submitResult.success ? "text-green-700" : "text-red-700"}>
            {submitResult.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Nama */}
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Masukkan nama lengkap Anda"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="nama@email.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Subjek */}
      <div className="space-y-2">
        <Label htmlFor="subject">Subjek *</Label>
        <Input
          id="subject"
          {...register("subject")}
          placeholder="Misal: Pertanyaan tentang kelas tari"
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p className="text-sm text-red-600">{errors.subject.message}</p>
        )}
      </div>

      {/* Pesan */}
      <div className="space-y-2">
        <Label htmlFor="message">Pesan *</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Tuliskan pesan Anda di sini..."
          rows={6}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Mengirim Pesan...
          </>
        ) : (
          "Kirim Pesan"
        )}
      </Button>

      <p className="text-sm text-muted-foreground">
        * Field yang wajib diisi
      </p>
    </form>
  );
}