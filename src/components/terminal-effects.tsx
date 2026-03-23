import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function ScanlineOverlay() {
  return (
    <>
      <div className="scanline-overlay pointer-events-none" />
      <div className="vignette-overlay pointer-events-none" />
    </>
  );
}

export function TerminalText({ text, speed = 30, className = "" }: { text: string, speed?: number, className?: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">_</span>
    </span>
  );
}

export function TerminalContainer({ children, className = "", title }: { children: React.ReactNode, className?: string, title?: string }) {
  return (
    <div className={`border border-primary/40 glow-box bg-card/80 backdrop-blur-md relative ${className}`}>
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
      
      {title && (
        <div className="absolute -top-3 left-4 bg-background px-2 text-xs text-primary/80 glow-text flex items-center gap-2">
          <span className="w-2 h-2 bg-primary animate-pulse-fast block" />
          [{title}]
        </div>
      )}
      
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
