"use client"; // Pastikan ini adalah Client Component

import { useEffect, useState } from "react";
import { RichTextViewer } from "@/components/editor/rich-text-viewer";
import { Badge } from "@/components/ui/badge";

interface PageContent {
  id?: string;
  pageKey: string;
  title: string;
  content: string;
  metadata?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PreviewClientProps {
  dbContent: PageContent;
}

export default function PreviewClient({ dbContent }: PreviewClientProps) {
  const [previewData, setPreviewData] = useState<PageContent | null>(null);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("pageContentPreview");
    if (sessionData) {
      const parsedData: PageContent = JSON.parse(sessionData);
      // Pastikan pageKey sama agar tidak salah load
      if (parsedData.pageKey === dbContent.pageKey) {
        setPreviewData(parsedData);
      }
    }
  }, [dbContent.pageKey]);

  if (!previewData) {
    // Kalau tidak ada data preview di session, tampilkan default dari DB saja
    return (
      <div>
        <h2>{dbContent.title}</h2>
        <RichTextViewer content={dbContent.content} />
      </div>
    );
  }

  // Kalau ada data preview, kita tampilkan data preview
  return (
    <div>
      <h2>{previewData.title}</h2>
      <RichTextViewer content={previewData.content} />

      {/* Contoh membandingkan data session vs data DB */}
      <DiffViewer dbContent={dbContent} preview={previewData} />
    </div>
  );
}

/**
 * Komponen contoh untuk menampilkan apa saja yang berubah
 */
function DiffViewer({ dbContent, preview }: { dbContent: PageContent; preview: PageContent }) {
  const changedFields = compareData(dbContent, preview);

  if (changedFields.length === 0) {
    return (
      <div className="mt-4 text-sm">
        <Badge>Data preview sama persis dengan data DB.</Badge>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-sm font-bold">Perbedaan Data:</h3>
      {changedFields.map(({ key, oldValue, newValue }) => (
        <div key={key} className="text-sm">
          <p>
            <strong>{key}:</strong>
          </p>
          <p>
            <span className="line-through text-muted-foreground mr-2">{oldValue ?? "(kosong)"}</span>
            <span className="text-green-600 ml-2">{newValue ?? "(kosong)"}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Fungsi untuk mencari mana saja field yang berubah
 */
function compareData(dbData: PageContent, sessionData: PageContent) {
  const changes: { key: string; oldValue: string | boolean | undefined; newValue: string | boolean | undefined }[] = [];
  
  (Object.keys(sessionData) as (keyof PageContent)[]).forEach((key) => {
    if (dbData[key] !== sessionData[key]) {
      changes.push({
        key,
        oldValue: dbData[key],
        newValue: sessionData[key],
      });
    }
  });
  
  return changes;
}