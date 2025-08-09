// components/molecules/error-boundary.tsx
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
}

class ErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; reset: () => void }> },
    ErrorBoundaryState
> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            const Fallback = this.props.fallback || DefaultErrorFallback
            return (
                <Fallback
                    error={this.state.error!}
                    reset={() => this.setState({ hasError: false, error: undefined })}
                />
            )
        }

        return this.props.children
    }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Terjadi Kesalahan
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
                Maaf, terjadi kesalahan tak terduga. Silakan coba lagi atau hubungi administrator.
            </p>
            <Button onClick={reset} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Coba Lagi
            </Button>
            {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 text-sm text-gray-500">
                    <summary className="cursor-pointer">Detail Error</summary>
                    <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                        {error.message}
                        {'\n'}
                        {error.stack}
                    </pre>
                </details>
            )}
        </div>
    )
}

export default ErrorBoundary