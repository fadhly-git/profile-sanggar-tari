"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopProps {
  scrollAreaRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollToTop({ scrollAreaRef }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const internalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Gunakan scrollAreaRef yang diberikan atau cari scroll area secara otomatis
    const scrollElement: HTMLDivElement | Window = scrollAreaRef?.current || 
                         internalScrollRef.current?.closest('[data-radix-scroll-area-viewport]') as HTMLDivElement ||
                         document.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement ||
                         window;

    const toggleVisibility = () => {
      let scrollTop = 0;
      
      if (scrollElement instanceof Window) {
        scrollTop = window.pageYOffset || window.scrollY;
      } else if (scrollElement instanceof HTMLElement) {
        scrollTop = scrollElement.scrollTop;
      }

      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleScroll = () => {
      toggleVisibility();
    };

    // Attach event listener
    if (scrollElement instanceof Window) {
      window.addEventListener('scroll', handleScroll);
    } else if (scrollElement instanceof HTMLElement) {
      scrollElement.addEventListener('scroll', handleScroll);
    }

    // Initial check
    toggleVisibility();

    return () => {
      if (scrollElement instanceof Window) {
        window.removeEventListener('scroll', handleScroll);
      } else if (scrollElement instanceof HTMLElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollAreaRef]);

  const scrollToTop = () => {
    const scrollElement: HTMLDivElement | Window = scrollAreaRef?.current || 
                         internalScrollRef.current?.closest('[data-radix-scroll-area-viewport]') as HTMLDivElement ||
                         document.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement ||
                         window;

    if (scrollElement instanceof Window) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else if (scrollElement instanceof HTMLElement) {
      scrollElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* Hidden ref element untuk auto-detection */}
      <div ref={internalScrollRef} className="hidden" />
      
      <div className="fixed bottom-8 right-8 z-50">
        {isVisible && (
          <Button
            onClick={scrollToTop}
            size="icon"
            className="rounded-full bg-primary/90 hover:bg-primary shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}
      </div>
    </>
  );
}