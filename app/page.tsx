import Link from 'next/link';
import { loadAllTopics, getFirstTopicSlug, buildChapterStructure } from '@/lib/content';

export default async function HomePage() {
  const topics = await loadAllTopics();
  const firstSlug = getFirstTopicSlug(topics);
  const chapters = buildChapterStructure(topics);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Digital Logic Design
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          An Interactive Textbook
        </p>
        <p className="text-gray-400 max-w-2xl mx-auto mb-12">
          Learn the fundamentals of digital logic design through interactive examples,
          clear explanations, and hands-on exercises. From basic gates to complex
          combinational circuits.
        </p>

        {firstSlug && (
          <Link
            href={`/${firstSlug}/`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
          >
            Start Reading
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        )}
      </div>

      {/* Table of Contents */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-semibold text-white mb-8 text-center">
          Table of Contents
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                {formatChapterTitle(chapter.title)}
              </h3>

              <ul className="space-y-2">
                {chapter.sections.map((section) => (
                  <li key={section.id}>
                    <div className="text-gray-400 text-sm mb-1">
                      {formatSectionTitle(section.title)}
                    </div>
                    <ul className="pl-4 space-y-1">
                      {section.topics.map((topic) => (
                        <li key={topic.slug}>
                          <Link
                            href={`/${topic.slug}/`}
                            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                          >
                            {topic.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>An open educational resource</p>
        </div>
      </footer>
    </div>
  );
}

function formatChapterTitle(name: string): string {
  return name
    .replace(/^\d+[-.]?\s*/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function formatSectionTitle(name: string): string {
  return name
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}
