'use client';

import { useState } from 'react';
import { ChapterGroup } from '@/lib/content/navigation';
import { TableOfContents } from '@/components/Navigation';

interface TwoPanelProps {
  graphicsPanel: React.ReactNode;
  textPanel: React.ReactNode;
  topNav?: React.ReactNode;
  chapters?: ChapterGroup[];
  currentSlug?: string;
}

export default function TwoPanel({
  graphicsPanel,
  textPanel,
  topNav,
  chapters,
  currentSlug
}: TwoPanelProps) {
  const [activeTab, setActiveTab] = useState<'graphics' | 'text'>('graphics');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <div className="flex-1 lg:grid lg:grid-cols-2">
          {/* Graphics Panel - Left */}
          <div
            className={`graphics-panel ${
              activeTab === 'graphics' ? 'block' : 'hidden lg:block'
            } lg:h-[calc(100vh-4rem)] lg:sticky lg:top-0`}
          >
            {graphicsPanel}
          </div>

          {/* Text Panel - Right */}
          <div
            className={`text-panel ${
              activeTab === 'text' ? 'block' : 'hidden lg:block'
            } lg:h-[calc(100vh-4rem)] lg:overflow-y-auto`}
          >
            {textPanel}
          </div>
        </div>
      </div>
    </div>
  );
}
