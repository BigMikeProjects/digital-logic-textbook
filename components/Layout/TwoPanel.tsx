'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ChapterGroup } from '@/lib/content/navigation';
import { TableOfContents } from '@/components/Navigation';

interface TwoPanelProps {
  graphicsPanel: React.ReactNode;
  textPanel: React.ReactNode;
  topNav?: React.ReactNode;
  chapters?: ChapterGroup[];
  currentSlug?: string;
}

const STORAGE_KEY = 'textbook-panel-width';
const DEFAULT_WIDTH = 50; // percentage
const MIN_WIDTH = 20;
const MAX_WIDTH = 80;

export default function TwoPanel({
  graphicsPanel,
  textPanel,
  topNav,
  chapters,
  currentSlug
}: TwoPanelProps) {
  const [activeTab, setActiveTab] = useState<'graphics' | 'text'>('graphics');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [graphicsWidth, setGraphicsWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load saved width from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const width = parseFloat(saved);
      if (width >= MIN_WIDTH && width <= MAX_WIDTH) {
        setGraphicsWidth(width);
      }
    }
  }, []);

  // Save width to localStorage when it changes
  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem(STORAGE_KEY, graphicsWidth.toString());
    }
  }, [graphicsWidth, isDragging]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clampedWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, percentage));
    setGraphicsWidth(clampedWidth);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add and remove global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Double-click to reset to default
  const handleDoubleClick = useCallback(() => {
    setGraphicsWidth(DEFAULT_WIDTH);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Desktop */}
      {chapters && currentSlug && (
        <aside className="hidden xl:block w-72 bg-white border-r border-gray-200 overflow-y-auto h-screen sticky top-0">
          <div className="p-4">
            <TableOfContents chapters={chapters} currentSlug={currentSlug} />
          </div>
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="xl:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {chapters && currentSlug && (
        <aside className={`
          xl:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <span className="font-semibold text-gray-900">Contents</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
            <TableOfContents chapters={chapters} currentSlug={currentSlug} />
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation */}
        {topNav && (
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center">
              {/* Menu button for mobile */}
              {chapters && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="xl:hidden p-3 text-gray-500 hover:text-gray-700"
                  aria-label="Open menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
              )}
              <div className="flex-1">
                {topNav}
              </div>
            </div>
          </header>
        )}

        {/* Mobile Tab Bar */}
        <div className="lg:hidden flex border-b border-gray-200 bg-white">
          <button
            className={`flex-1 mobile-tab ${
              activeTab === 'graphics' ? 'mobile-tab-active' : 'mobile-tab-inactive'
            }`}
            onClick={() => setActiveTab('graphics')}
          >
            Graphics
          </button>
          <button
            className={`flex-1 mobile-tab ${
              activeTab === 'text' ? 'mobile-tab-active' : 'mobile-tab-inactive'
            }`}
            onClick={() => setActiveTab('text')}
          >
            Text
          </button>
        </div>

        {/* Two Panel Layout */}
        <div ref={containerRef} className="flex-1 lg:flex">
          {/* Graphics Panel - Left */}
          <div
            className={`graphics-panel ${
              activeTab === 'graphics' ? 'block' : 'hidden lg:block'
            } lg:h-[calc(100vh-4rem)] lg:sticky lg:top-0`}
            style={{ width: `${graphicsWidth}%` }}
          >
            {graphicsPanel}
          </div>

          {/* Resizable Divider - Desktop only */}
          <div
            className="hidden lg:flex items-center justify-center w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors group relative"
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            title="Drag to resize, double-click to reset"
          >
            {/* Visual handle indicator */}
            <div className={`absolute inset-y-0 -left-1 -right-1 ${isDragging ? 'bg-blue-500/20' : ''}`} />
            <div className={`w-1 h-12 rounded-full ${isDragging ? 'bg-blue-600' : 'bg-gray-400 group-hover:bg-blue-500'} transition-colors`} />
          </div>

          {/* Text Panel - Right */}
          <div
            className={`text-panel ${
              activeTab === 'text' ? 'block' : 'hidden lg:block'
            } lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:flex-1`}
          >
            {textPanel}
          </div>
        </div>
      </div>
    </div>
  );
}
