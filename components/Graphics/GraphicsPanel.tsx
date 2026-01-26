'use client';

import { useState, useEffect, useCallback } from 'react';
import { GraphicItem } from '@/lib/types/content';
import GraphicViewer from './GraphicViewer';

interface GraphicsPanelProps {
  graphics: GraphicItem[];
}

export default function GraphicsPanel({ graphics }: GraphicsPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev < graphics.length - 1 ? prev + 1 : prev));
  }, [graphics.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  if (graphics.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p>No graphics available for this topic</p>
      </div>
    );
  }

  const currentGraphic = graphics[currentIndex];

  return (
    <div className="h-full flex flex-col">
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        {/* Previous button */}
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="graphics-nav-button absolute left-4 z-10"
          aria-label="Previous graphic"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Graphic viewer */}
        <div className="w-full max-w-4xl">
          <GraphicViewer graphic={currentGraphic} />
        </div>

        {/* Next button */}
        <button
          onClick={goToNext}
          disabled={currentIndex === graphics.length - 1}
          className="graphics-nav-button absolute right-4 z-10"
          aria-label="Next graphic"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Caption and counter */}
      <div className="p-4 text-center">
        {currentGraphic.caption && (
          <p className="text-gray-300 text-sm mb-2">{currentGraphic.caption}</p>
        )}
        <p className="text-gray-500 text-xs">
          {currentIndex + 1} / {graphics.length}
        </p>
      </div>
    </div>
  );
}
