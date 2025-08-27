// @/app/(public)/artikel/[slug]/article-enhancements.tsx
"use client";

import { useEffect } from 'react';

export default function ArticleEnhancements() {
  useEffect(() => {
    // Reading Progress Bar
    const updateReadingProgress = () => {
      const article = document.querySelector('article');
      const progressBar = document.getElementById('reading-progress');
      
      if (!article || !progressBar) return;

      const scrollTop = window.scrollY;
      const docHeight = article.offsetHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      const scrollPercentRounded = Math.round(scrollPercent * 100);
      
      progressBar.style.width = `${Math.min(scrollPercentRounded, 100)}%`;
    };

    // Smooth scroll for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.slice(1);
        const element = document.getElementById(id || '');
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', updateReadingProgress);
    document.addEventListener('click', handleAnchorClick);

    // Initial call
    updateReadingProgress();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', updateReadingProgress);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  useEffect(() => {
    // Add loading animation to images
    const images = document.querySelectorAll('article img');
    images.forEach((img) => {
      if (img instanceof HTMLImageElement) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
        
        const handleLoad = () => {
          img.style.opacity = '1';
        };

        if (img.complete) {
          handleLoad();
        } else {
          img.addEventListener('load', handleLoad);
        }
      }
    });

    // Add hover effects to links
    const links = document.querySelectorAll('article a');
    links.forEach((link) => {
      link.classList.add('hover:text-primary', 'transition-colors', 'duration-200');
    });

    // Add copy code functionality to code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      const pre = block.parentElement;
      if (pre) {
        pre.style.position = 'relative';
        
        const copyButton = document.createElement('button');
        copyButton.innerText = 'Salin';
        copyButton.className = 'absolute top-2 right-2 px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors';
        copyButton.onclick = () => {
          navigator.clipboard.writeText(block.textContent || '');
          copyButton.innerText = 'Tersalin!';
          setTimeout(() => {
            copyButton.innerText = 'Salin';
          }, 2000);
        };
        
        pre.appendChild(copyButton);
      }
    });
  }, []);

  return null;
}
