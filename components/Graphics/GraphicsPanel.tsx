'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GraphicItem } from '@/lib/types/content';
import GraphicViewer from './GraphicViewer';

const AUTO_SCROLL_INTERVAL = 6000; // ms between auto-advances

interface GraphicsPanelProps {
  graphics: GraphicItem[];
}

export default function GraphicsPanel({ graphics }: GraphicsPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScrollActive, setAutoScrollActive] = useState(graphics.length > 1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopAutoScroll = useCallback(() => {
    setAutoScrollActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const goToPrev = useCallback(() => {
    stopAutoScroll();
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  }, [stopAutoScroll]);

  const goToNext = useCallback(() => {
    stopAutoScroll();
    setCurrentIndex(prev => (prev < graphics.length - 1 ? prev + 1 : prev));
  }, [stopAutoScroll, graphics.length]);

  // Auto-scroll through graphics
  useEffect(() => {
    if (!autoScrollActive || graphics.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= graphics.length - 1) {
          return 0; // Loop back to start
        }
        return prev + 1;
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoScrollActive, graphics.length]);

  // Stop auto-scroll when user clicks into an iframe (YouTube, HTML interactive)
  useEffect(() => {
    if (!autoScrollActive) return;

    const handleBlur = () => {
      stopAutoScroll();
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [autoScrollActive, stopAutoScroll]);

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
      <div className="flex-1 flex items-center justify-center p-4 relative" onPointerDown={stopAutoScroll}>
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

      {/* Caption and navigation dots */}
      <div className="p-4 text-center">
        {currentGraphic.caption && (
          <p className="text-gray-300 text-sm mb-2">{currentGraphic.caption}</p>
        )}
        {graphics.length > 1 ? (
          <div className="flex items-center justify-center gap-1.5">
            {graphics.map((_, index) => (
              <button
                key={index}
                onClick={() => { stopAutoScroll(); setCurrentIndex(index); }}
                className={`rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-2.5 h-2.5 bg-blue-400'
                    : 'w-2 h-2 bg-gray-500 hover:bg-gray-400'
                }`}
                aria-label={`Go to graphic ${index + 1}`}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-xs">
            {currentIndex + 1} / {graphics.length}
          </p>
        )}
      </div>
    </div>
  );
}
