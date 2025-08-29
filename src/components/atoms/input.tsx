// components/atoms/input.tsx
import { forwardRef, useState } from 'react'
import { Input as ShadcnInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <Label htmlFor={props.id} className="text-sm font-medium">
                        {label}
                    </Label>
                )}
                <ShadcnInput
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

Input.displayName = "Input"

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className="space-y-2">
                {label && (
                    <Label htmlFor={props.id} className="text-sm font-medium">
                        {label}
                    </Label>
                )}
                <div className="relative">
                    <ShadcnInput
                        ref={ref}
                        type={showPassword ? "text" : "password"}
                        className={cn(
                            error && "border-red-500 focus:border-red-500",
                            className
                        )}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                        </span>
                    </button>
                </div>
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
                {helperText && !error && (
                    <p className="text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";