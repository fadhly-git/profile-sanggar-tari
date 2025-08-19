// @/app/admin/pengaturan-website/page.tsx
import { Suspense } from "react"
import { getAllSettings, initializePredefinedSettings } from "@/lib/actions/setting-actions"
import { SettingsPageClient } from "@/components/admin/settings/setting-client"
import { Skeleton } from "@/components/ui/skeleton"

export default async function SettingsPage() {
  // Initialize predefined settings
  await initializePredefinedSettings()
  
  // Get all settings
  const result = await getAllSettings()
  
  if (!result.success) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-red-600">
          {result.error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<SettingsPageSkeleton />}>
        <SettingsPageClient initialData={result.data ?? []} />
      </Suspense>
    </div>
  )
}

function SettingsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}