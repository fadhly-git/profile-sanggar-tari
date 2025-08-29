"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Prevent hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    const getCurrentThemeDisplay = () => {
        if (!mounted) {
            return { text: "Theme", icon: Sun } // Default saat belum mounted
        }

        switch (theme) {
            case "light":
                return { text: "Light", icon: Sun }
            case "dark":
                return { text: "Dark", icon: Moon }
            case "system":
                return { text: "System", icon: Monitor }
            default:
                return { text: "Theme", icon: Sun }
        }
    }

    const currentTheme = getCurrentThemeDisplay()

    // Show loading state atau fallback selama hydration
    if (!mounted) {
        return (
            <div {...props}>
                <Button
                    variant="outline"
                    className="h-9 md:h-10 justify-start md:justify-center px-3 md:px-3 md:w-10 touch-manipulation gap-2 md:gap-0 min-w-fit md:min-w-10"
                    disabled
                >
                    <div className="relative flex-shrink-0">
                        <Sun className="h-4 w-4 md:h-[1.2rem] md:w-[1.2rem]" />
                    </div>
                    <span className="text-sm font-medium md:hidden whitespace-nowrap">
                        Theme
                    </span>
                </Button>
            </div>
        )
    }

    return (
        <div {...props}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-9 md:h-10 justify-start md:justify-center px-3 md:px-3 md:w-10 touch-manipulation gap-2 md:gap-0 min-w-fit md:min-w-10"
                    >
                        {/* Icon area dengan animasi yang sama */}
                        <div className="relative flex-shrink-0">
                            <Sun className="h-4 w-4 md:h-[1.2rem] md:w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                            <Moon className="absolute top-0 left-0 h-4 w-4 md:h-[1.2rem] md:w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                        </div>

                        {/* Teks hanya tampil di mobile */}
                        <span className="text-sm font-medium md:hidden whitespace-nowrap">
                            {currentTheme.text}
                        </span>

                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="z-100 min-w-[130px]"
                    sideOffset={5}
                >
                    <DropdownMenuItem
                        onClick={() => setTheme("light")}
                        className="cursor-pointer py-2.5 text-sm focus:bg-accent focus:text-accent-foreground"
                    >
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light</span>
                        {theme === "light" && (
                            <span className="ml-auto text-xs opacity-60">✓</span>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setTheme("dark")}
                        className="cursor-pointer py-2.5 text-sm focus:bg-accent focus:text-accent-foreground"
                    >
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark</span>
                        {theme === "dark" && (
                            <span className="ml-auto text-xs opacity-60">✓</span>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setTheme("system")}
                        className="cursor-pointer py-2.5 text-sm focus:bg-accent focus:text-accent-foreground"
                    >
                        <Monitor className="mr-2 h-4 w-4" />
                        <span>System</span>
                        {theme === "system" && (
                            <span className="ml-auto text-xs opacity-60">✓</span>
                        )}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}