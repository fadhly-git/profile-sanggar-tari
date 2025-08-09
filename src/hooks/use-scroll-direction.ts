"use client"
// hooks/use-scroll-area-scroll.ts
import { useEffect, useRef, useState } from 'react';

export function useScrollAreaScroll() {
    const [scrolled, setScrolled] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const handleScroll = () => {
            setScrolled(el.scrollTop > 0);
        };

        el.addEventListener('scroll', handleScroll);
        handleScroll(); // Cek awal

        return () => {
            el.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return { scrolled, scrollAreaRef: ref };
}
