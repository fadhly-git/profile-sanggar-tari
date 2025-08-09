"use client"

import React, { createContext, useContext, useRef } from "react"

// Only provide the ref in context
type ScrollAreaContextType = {
    scrollAreaRef: React.RefObject<HTMLDivElement | null>
}

const ScrollAreaContext = createContext<ScrollAreaContextType>({
    scrollAreaRef: { current: null }
})

export function useScrollArea() {
    return useContext(ScrollAreaContext)
}

export function ScrollAreaProvider({ children }: { children: React.ReactNode }) {
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    return (
        <ScrollAreaContext.Provider value={{ scrollAreaRef }}>
            <div ref={scrollAreaRef} className="scroll-area">
                {children}
            </div>
        </ScrollAreaContext.Provider>
    )
}