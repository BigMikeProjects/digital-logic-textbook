import Link from 'next/link';
import { NavigationContext } from '@/lib/types/content';

interface TopNavProps {
  navigation: NavigationContext;
  /** When the topic is on the course schedule: "Lecture 5 · Wed Sep 2" badge → /schedule/ */
  lectureBadge?: { lec: number; label: string } | null;
}

export default function TopNav({ navigation, lectureBadge }: TopNavProps) {
  const { current, prev, next } = navigation;

  return (
    <nav className="px-4 py-3 flex items-center justify-between">
      {/* Previous button */}
      <div className="w-32">
        {prev ? (
          <Link
            href={`/${prev.slug}/`}
            className="nav-button nav-button-secondary inline-flex items-center gap-1 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span>Previous</span>
          </Link>
        ) : (
          <span />
        )}
      </div>

      {/* Section title */}
      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold text-gray-900 truncate">
          {current.title}
        </h1>
        <p className="text-xs text-gray-500 truncate">
          {current.chapter && current.section
            ? `${formatName(current.chapter)} › ${formatName(current.section)}`
            : current.chapter
            ? formatName(current.chapter)
            : ''}
          {lectureBadge && (
            <>
              {' · '}
              <Link
                href="/schedule/"
                className="inline-block align-middle rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-xs font-medium hover:bg-blue-100"
                title="See the full course schedule"
              >
                {lectureBadge.label}
              </Link>
            </>
          )}
        </p>
      </div>

      {/* Next button */}
      <div className="w-32 text-right">
        {next ? (
          <Link
            href={`/${next.slug}/`}
            className="nav-button nav-button-primary inline-flex items-center gap-1 text-sm"
          >
            <span>Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </nav>
  );
}

function formatName(name: string): string {
  // Remove numeric prefix (e.g., "02-combinational-logic" -> "combinational-logic")
  const withoutPrefix = name.replace(/^\d+[-.]?/, '');
  // Replace hyphens with spaces and capitalize
  return withoutPrefix
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}
