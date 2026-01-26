'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChapterGroup } from '@/lib/content/navigation';

interface TableOfContentsProps {
  chapters: ChapterGroup[];
  currentSlug: string;
}

export default function TableOfContents({ chapters, currentSlug }: TableOfContentsProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(() => {
    // Auto-expand chapter containing current topic
    const expanded = new Set<string>();
    for (const chapter of chapters) {
      for (const section of chapter.sections) {
        if (section.topics.some(t => t.slug === currentSlug)) {
          expanded.add(chapter.id);
        }
      }
    }
    return expanded;
  });

  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    // Auto-expand section containing current topic
    const expanded = new Set<string>();
    for (const chapter of chapters) {
      for (const section of chapter.sections) {
        if (section.topics.some(t => t.slug === currentSlug)) {
          expanded.add(`${chapter.id}/${section.id}`);
        }
      }
    }
    return expanded;
  });

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const toggleSection = (chapterId: string, sectionId: string) => {
    const key = `${chapterId}/${sectionId}`;
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <nav className="toc-nav">
      <h2 className="text-lg font-bold text-gray-900 mb-4 px-2">Contents</h2>
      <ul className="space-y-1">
        {chapters.map((chapter, chapterIndex) => (
          <li key={chapter.id}>
            {/* Chapter */}
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full flex items-center gap-2 px-2 py-2 text-left text-sm font-semibold text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              <ChevronIcon expanded={expandedChapters.has(chapter.id)} />
              <span className="text-gray-400 font-normal">{chapterIndex + 1}.</span>
              <span className="flex-1 truncate">{chapter.title}</span>
            </button>

            {/* Sections */}
            {expandedChapters.has(chapter.id) && (
              <ul className="ml-4 mt-1 space-y-1">
                {chapter.sections.map((section, sectionIndex) => (
                  <li key={section.id}>
                    {/* Section */}
                    <button
                      onClick={() => toggleSection(chapter.id, section.id)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronIcon expanded={expandedSections.has(`${chapter.id}/${section.id}`)} />
                      <span className="text-gray-400 text-xs">{chapterIndex + 1}.{sectionIndex + 1}</span>
                      <span className="flex-1 truncate">{section.title}</span>
                    </button>

                    {/* Topics */}
                    {expandedSections.has(`${chapter.id}/${section.id}`) && (
                      <ul className="ml-6 mt-1 space-y-0.5">
                        {section.topics.map((topic) => (
                          <li key={topic.slug}>
                            <Link
                              href={`/${topic.slug}/`}
                              className={`block px-2 py-1.5 text-sm rounded-lg truncate ${
                                topic.slug === currentSlug
                                  ? 'bg-blue-100 text-blue-700 font-medium'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {topic.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
