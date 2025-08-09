// components/ui/loading-button.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { forwardRef, ReactNode } from "react"

interface LoadingButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    loading?: boolean
    children?: ReactNode
    disabled?: boolean
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
    ({ children, loading, disabled, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                disabled={loading || disabled}
                {...props}
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </Button>
        )
    }
)

LoadingButton.displayName = "LoadingButton"

export { LoadingButton }