// @/components/molecules/setting-detail-dialog.tsx
"use client"

import { Setting } from "@prisma/client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { BadgeStatus } from "@/components/atoms/badge-status"
import Image from "next/image"

interface SettingDetailDialogProps {
    setting: Setting | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

const typeLabels = {
    TEXT: "Teks",
    TEXTAREA: "Area Teks",
    IMAGE: "Gambar",
    BOOLEAN: "Boolean",
    JSON: "JSON",
}

const typeColors = {
    TEXT: "info" as const,
    TEXTAREA: "warning" as const,
    IMAGE: "success" as const,
    BOOLEAN: "danger" as const,
    JSON: "warning" as const,
}

export function SettingDetailDialog({ setting, open, onOpenChange }: SettingDetailDialogProps) {
    if (!setting) return null

    const renderValue = () => {
        switch (setting.type) {
            case "IMAGE":
                return setting.value ? (
                    <div className="space-y-2">
                        <Image
                            style={{ width: "100%", height: "auto", maxHeight: "300px" }}
                            width={300}
                            height={300}
                            src={setting.value}
                            alt="Setting Image"
                            className="max-w-full h-auto max-h-64 rounded border"
                        />
                        <p className="text-sm text-muted-foreground break-all">{setting.value}</p>
                    </div>
                ) : (
                    <p className="text-muted-foreground italic">Tidak ada gambar</p>
                )

            case "BOOLEAN":
                const isTrue = setting.value === "true"
                return (
                    <BadgeStatus status={isTrue ? "success" : "danger"}>
                        {isTrue ? "Ya" : "Tidak"}
                    </BadgeStatus>
                )

            case "JSON":
                try {
                    const jsonValue = JSON.parse(setting.value)
                    return (
                        <pre className="bg-muted p-3 rounded text-sm overflow-auto max-h-64">
                            {JSON.stringify(jsonValue, null, 2)}
                        </pre>
                    )
                } catch {
                    return (
                        <pre className="bg-muted p-3 rounded text-sm overflow-auto max-h-64">
                            {setting.value}
                        </pre>
                    )
                }

            default:
                return (
                    <div className="bg-muted p-3 rounded">
                        <p className="whitespace-pre-wrap break-words">{setting.value}</p>
                    </div>
                )
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detail Pengaturan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Key:</label>
                            <p className="text-sm mt-1 font-mono bg-muted p-2 rounded">{setting.key}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Tipe:</label>
                            <div className="mt-1">
                                <BadgeStatus status={typeColors[setting.type]}>
                                    {typeLabels[setting.type]}
                                </BadgeStatus>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Value:</label>
                        <div className="mt-2">
                            {renderValue()}
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        ID: {setting.id}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}