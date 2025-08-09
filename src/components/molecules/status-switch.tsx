// components/molecules/status-switch.tsx
'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { updateJadwalStatus } from '@/lib/actions/jadwal-actions'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface StatusSwitchProps {
    jadwalId: bigint
    currentStatus: number
    disabled?: boolean
    size?: 'sm' | 'md'
}

export function StatusSwitch({ jadwalId, currentStatus, disabled = false, size = 'md' }: StatusSwitchProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState(currentStatus === 1)

    const handleStatusChange = async (checked: boolean) => {
        if (disabled || isLoading) return

        setIsLoading(true)
        const newStatus = checked ? 1 : 0

        try {
            const result = await updateJadwalStatus(jadwalId, newStatus)

            if (result.success) {
                setStatus(checked)
                toast.success("Berhasil", {
                    description: `Status jadwal ${checked ? 'diaktifkan' : 'dinonaktifkan'}`,
                })
            } else {
                toast.error("Gagal", {
                    description: result.error
                })
            }
        } catch (error) {
            toast.error("Terjadi kesalahan:", {
                description: error instanceof Error ? error.message : String(error)
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <Switch
                checked={status}
                onCheckedChange={handleStatusChange}
                disabled={disabled || isLoading}
                className={cn(
                    size === 'sm' && "scale-90"
                )}
            />
            <span className={cn(
                "text-sm font-medium transition-colors",
                status ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400",
                size === 'sm' && "text-xs"
            )}>
                {status ? 'Aktif' : 'Nonaktif'}
            </span>
            {isLoading && (
                <div className="ml-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-gray-100"></div>
                </div>
            )}
        </div>
    )
}