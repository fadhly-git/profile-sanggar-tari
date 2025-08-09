"use client"
import { useScrollAreaScroll } from "@/hooks/use-scroll-direction"
import { cn } from "@/lib/utils";
import * as ScrollArea from "@radix-ui/react-scroll-area"
import { forwardRef } from "react";

interface MainScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    showScrollbar?: boolean;
    scrollbarOrientation?: "vertical" | "horizontal" | "both";
    bottomSpacing?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const MainScrollArea = forwardRef<HTMLDivElement, MainScrollAreaProps>(
    ({
        children,
        className,
        showScrollbar = true,
        scrollbarOrientation = "vertical",
        bottomSpacing = "lg",
        ...props
    }, ref) => {
        const { scrollAreaRef } = useScrollAreaScroll();

        // Bottom spacing variants
        const bottomSpacingClasses = {
            sm: "pb-4 md:pb-6",
            md: "pb-6 md:pb-8",
            lg: "pb-8 md:pb-12",
            xl: "pb-12 md:pb-16",
            "2xl": "pb-16 md:pb-20"
        };

        return (
            <ScrollArea.Root className="h-screen w-full overflow-hidden">
                <ScrollArea.Viewport
                    ref={scrollAreaRef}
                    className="h-full w-full rounded-[inherit]"
                >
                    <div
                        ref={ref}
                        className={cn(
                            "w-full min-h-full flex-grow",
                            "pt-4 px-4 md:pt-6 md:px-6 lg:pt-8 lg:px-8", // Top and horizontal padding
                            bottomSpacingClasses[bottomSpacing], // Dynamic bottom spacing
                            className
                        )}
                        {...props}
                    >
                        {children}
                    </div>
                    {/* Extra bottom spacer untuk memastikan scroll sampai akhir */}
                    <div className="h-4 md:h-6 lg:h-8" aria-hidden="true" />
                </ScrollArea.Viewport>

                {showScrollbar && (scrollbarOrientation === "vertical" || scrollbarOrientation === "both") && (
                    <ScrollArea.Scrollbar
                        orientation="vertical"
                        className="flex touch-none select-none transition-colors duration-150 ease-out hover:bg-muted/50 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col"
                    >
                        <ScrollArea.Thumb className="relative flex-1 rounded-full bg-border transition-colors duration-150 ease-out hover:bg-border/80" />
                    </ScrollArea.Scrollbar>
                )}

                {showScrollbar && (scrollbarOrientation === "horizontal" || scrollbarOrientation === "both") && (
                    <ScrollArea.Scrollbar
                        orientation="horizontal"
                        className="flex touch-none select-none transition-colors duration-150 ease-out hover:bg-muted/50 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col"
                    >
                        <ScrollArea.Thumb className="relative flex-1 rounded-full bg-border transition-colors duration-150 ease-out hover:bg-border/80" />
                    </ScrollArea.Scrollbar>
                )}

                {showScrollbar && scrollbarOrientation === "both" && <ScrollArea.Corner />}
            </ScrollArea.Root>
        )
    }
);

MainScrollArea.displayName = "MainScrollArea";