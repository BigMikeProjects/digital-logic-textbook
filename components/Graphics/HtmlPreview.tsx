'use client';

import { useState } from 'react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface HtmlPreviewProps {
  src: string;
  title: string;
}

export default function HtmlPreview({ src, title }: HtmlPreviewProps) {
  const fullSrc = src.startsWith('/') ? `${basePath}${src}` : src;
  const [isLoaded, setIsLoaded] = useState(false);

  const openFullScreen = () => {
    window.open(fullSrc, '_blank');
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400">
          <span className="text-sm">Loading interactive content...</span>
        </div>
      )}

      {/* Live iframe preview */}
      <iframe
        src={fullSrc}
        sandbox="allow-scripts"
        title={title}
        className="w-full h-full border-0"
        onLoad={() => setIsLoaded(true)}
      />

      {/* Full screen overlay button */}
      <button
        onClick={openFullScreen}
        className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/50 hover:bg-black/70 text-white text-sm transition-colors backdrop-blur-sm"
        title="Open in full screen"
      >
        <span>Full Screen</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>
      </button>
    </div>
  );
}
