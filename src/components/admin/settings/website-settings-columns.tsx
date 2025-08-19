// @/app/admin/pengaturan-website/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Setting, SettingType } from "@prisma/client"
import { BadgeStatus } from "@/components/atoms/badge-status"
import { StatusBadge } from "@/components/atoms/badge-status"
import Image from "next/image"

const typeLabels: Record<SettingType, string> = {
    TEXT: "Teks",
    TEXTAREA: "Area Teks",
    IMAGE: "Gambar",
    BOOLEAN: "Boolean",
    JSON: "JSON",
}

const typeColors: Record<SettingType, "success" | "warning" | "danger" | "info"> = {
    TEXT: "info",
    TEXTAREA: "warning",
    IMAGE: "success",
    BOOLEAN: "danger",
    JSON: "warning",
}

export const columns: ColumnDef<Setting>[] = [
    {
        accessorKey: "key",
        header: "Key",
        cell: ({ row }) => (
            <div className="font-medium">
                {row.getValue("key")}
            </div>
        ),
    },
    {
        accessorKey: "type",
        header: "Tipe",
        cell: ({ row }) => {
            const type = row.getValue("type") as SettingType
            return (
                <BadgeStatus status={typeColors[type]}>
                    {typeLabels[type]}
                </BadgeStatus>
            )
        },
    },
    {
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => {
            const value = row.getValue("value") as string
            const type = row.original.type

            if (type === "IMAGE" && value) {
                return (
                    <div className="flex items-center gap-2">
                        <Image
                            style={{ width: "32px", height: "32px" }}
                            width={32}
                            height={32}
                            src={value}
                            alt="Preview"
                            className="h-8 w-8 rounded object-cover"
                        />
                        <StatusBadge text={value} maxLength={30} />
                    </div>
                )
            }

            if (type === "BOOLEAN") {
                const isTrue = value === "true"
                return (
                    <BadgeStatus status={isTrue ? "success" : "danger"}>
                        {isTrue ? "Ya" : "Tidak"}
                    </BadgeStatus>
                )
            }

            return <StatusBadge text={value} maxLength={50} />
        },
    },
]