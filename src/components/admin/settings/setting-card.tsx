// @/components/molecules/setting-card.tsx
"use client"

import { Setting } from "@prisma/client"
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { BadgeStatus } from "@/components/atoms/badge-status"
import { StatusBadge } from "@/components/atoms/badge-status"
import Image from "next/image"

interface SettingCardProps {
  setting: Setting
  onView: (setting: Setting) => void
  onEdit: (setting: Setting) => void
  onDelete: (setting: Setting) => void
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

export function SettingCard({ setting, onView, onEdit, onDelete }: SettingCardProps) {
  const renderValue = () => {
    if (setting.type === "IMAGE" && setting.value) {
      return (
        <div className="flex items-center gap-2">
          <Image
            fill
            style={{ width: "32px", height: "32px" }} 
            src={setting.value} 
            alt="Preview" 
            className="h-8 w-8 rounded object-cover"
          />
          <StatusBadge text={setting.value} maxLength={20} />
        </div>
      )
    }
    
    if (setting.type === "BOOLEAN") {
      const isTrue = setting.value === "true"
      return (
        <BadgeStatus status={isTrue ? "success" : "danger"}>
          {isTrue ? "Ya" : "Tidak"}
        </BadgeStatus>
      )
    }
    
    return <StatusBadge text={setting.value} maxLength={30} />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <p className="font-medium leading-none">{setting.key}</p>
          <BadgeStatus status={typeColors[setting.type]}>
            {typeLabels[setting.type]}
          </BadgeStatus>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Buka menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(setting)}>
              <Eye className="mr-2 h-4 w-4" />
              Lihat Detail
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(setting)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(setting)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Value:</p>
            {renderValue()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}