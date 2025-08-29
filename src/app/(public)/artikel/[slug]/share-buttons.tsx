// @/app/(public)/artikel/[slug]/share-buttons.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, FacebookIcon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { TelegramIcon, WhatsappIcon, XIcon } from "@/components/atoms/d";

interface ShareButtonsProps {
  url: string;
  title: string;
  size?: "sm" | "default";
}

export default function ShareButtons({ url, title, size = "default" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Gagal menyalin link");
      console.error("Failed to copy: ", err);
    }
  };

  const handleShare = (platform: string) => {
    const shareUrl = shareLinks[platform as keyof typeof shareLinks];
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const buttonSize = size === "sm" ? "sm" : "default";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <div className="flex items-center gap-2">
      {/* Direct share buttons for mobile */}
      <div className="flex gap-2 sm:hidden">
        <Button
          variant="outline"
          size={buttonSize}
          onClick={() => handleShare('whatsapp')}
          className="text-white bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <span className="text-lg">
            <WhatsappIcon className="h-5 w-5" />
          </span>
          {size === "default" && <span className="ml-1">WA</span>}
        </Button>
        <Button
          variant="outline"
          size={buttonSize}
          onClick={() => handleShare('facebook')}
          className="text-white bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <span className="text-lg mr-2 bg-blue-600 p-0.5 rounded-md">
            <FacebookIcon className="h-4 w-4" />
          </span>
          {size === "default" && <span className="ml-1">FB</span>}
        </Button>
      </div>

      {/* Desktop share buttons */}
      <div className="hidden sm:flex gap-3">
        <Button
          variant="outline"
          size={buttonSize}
          onClick={() => handleShare('whatsapp')}
          className="text-white bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
        >
          <span className="text-lg mr-2">
            <WhatsappIcon className="h-5 w-5" />
          </span>
          WhatsApp
        </Button>
        <Button
          variant="outline"
          size={buttonSize}
          onClick={() => handleShare('facebook')}
          className="text-white bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
        >
          <span className="text-lg mr-2 bg-blue-600 p-0.5 rounded-md">
            <FacebookIcon className="h-4 w-4" />
          </span>
          Facebook
        </Button>
        <Button
          variant="outline"
          size={buttonSize}
          onClick={() => handleShare('twitter')}
          className="text-white bg-sky-500 border-sky-500 hover:bg-sky-600 hover:border-sky-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
        >
          <span className="text-lg mr-2 bg-black p-0.5 rounded-md">
            <XIcon className="h-4 w-4" />
          </span>
          Twitter / X
        </Button>
      </div>

      {/* More options dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={buttonSize} className="border-border/50 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300">
            <Share2 className={iconSize} />
            {size === "default" && <span className="ml-2">Lainnya</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 border-border/50 shadow-lg">
          <DropdownMenuItem onClick={() => handleShare('telegram')} className="hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors cursor-pointer">
            <span className="text-lg mr-3">
              <TelegramIcon className="h-5 w-5 text-blue-500 bg-white rounded-full" />
            </span>
            Telegram
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('twitter')} className="hover:bg-sky-50 dark:hover:bg-sky-950/20 transition-colors cursor-pointer sm:hidden">
            <span className="text-lg mr-2 bg-black p-0.5 rounded-md">
              <XIcon className="h-4 w-4" />
            </span>
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLink} className="hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors cursor-pointer">
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-3 text-green-600" />
                <span className="text-green-600 font-medium">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-3" />
                Salin Link
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}