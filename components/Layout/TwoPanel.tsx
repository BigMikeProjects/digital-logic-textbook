'use client';

import { useState } from 'react';

interface TwoPanelProps {
  graphicsPanel: React.ReactNode;
  textPanel: React.ReactNode;
  topNav?: React.ReactNode;
}

export default function TwoPanel({ graphicsPanel, textPanel, topNav }: TwoPanelProps) {
  const [activeTab, setActiveTab] = useState<'graphics' | 'text'>('graphics');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      {topNav && (
        <header className="bg-white border-b border-gray-200 shadow-sm">
          {topNav}
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
  );
}
