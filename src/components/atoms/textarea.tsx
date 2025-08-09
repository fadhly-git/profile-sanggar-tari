// components/atoms/textarea.tsx
import { forwardRef } from 'react'
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, helperText, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <Label htmlFor={props.id} className="text-sm font-medium">
                        {label}
                    </Label>
                )}
                <ShadcnTextarea
                    ref={ref}
                    className={cn(
                        error && "border-red-500 focus:border-red-500",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
                {helperText && !error && (
                    <p className="text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        )
    }
)

Textarea.displayName = "Textarea"