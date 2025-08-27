// components/ui/badge-status.tsx
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TextTruncate } from "./text-truncate"

interface BadgeStatusProps {
    status: 'success' | 'warning' | 'danger' | 'info'
    children: React.ReactNode
    className?: string
    onClick?: () => void
}

interface StatusBadgeProps {
  text?: string
  maxLength?: number
  variant?: "default" | "secondary" | "destructive" | "outline"
}

const statusVariants = {
    success: 'bg-green-100 text-green-800 hover:bg-green-100',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    danger: 'bg-red-100 text-red-800 hover:bg-red-100',
    info: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
}

export function BadgeStatus({ status, children, className, ...props}: BadgeStatusProps) {
    return (
        <Badge
            variant="secondary"
            className={cn(statusVariants[status], className)}
            {...props}
        >
            {children}
        </Badge>
    )
}

export function StatusBadge({ text, maxLength = 15, variant = "outline" }: StatusBadgeProps) {
  if (!text) {
    return <span className="text-muted-foreground text-xs">-</span>
  }

  return (
    <Badge variant={variant} className="text-xs">
      <TextTruncate text={text} maxLength={maxLength} />
    </Badge>
  )
}