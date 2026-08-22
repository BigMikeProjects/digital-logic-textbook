import Link from 'next/link';
import { NavigationContext } from '@/lib/types/content';

interface LectureNeighborLink {
  slug: string;
  title: string;
  lec: number;
  sameLecture: boolean;
}

interface TopNavProps {
  navigation: NavigationContext;
  /** When the topic is on the course schedule: "Lecture 5 · Wed Sep 2" badge → /schedule/ */
  lectureBadge?: { lec: number; label: string } | null;
  /** Next topic in LECTURE order (course order) — may differ from book-order `next` */
  lectureNext?: LectureNeighborLink | null;
  /** Previous topic in LECTURE order — the mirror of lectureNext */
  lecturePrev?: LectureNeighborLink | null;
}

const BackArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2}
    stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

export default function TopNav({ navigation, lectureBadge, lectureNext, lecturePrev }: TopNavProps) {
  const { current, prev, next } = navigation;

  return (
    <nav className="px-4 py-3 flex items-center justify-between">
      {/* Previous buttons — mirror of the Next side: same two orders through the book.
          Violet = lecture (course) order, blue = the text's logical order; the violet
          buttons sit innermost so the two orders flank the title symmetrically. */}
      <div className="flex items-center justify-start gap-2 shrink-0">
        {prev ? (
          <Link
            href={`/${prev.slug}/`}
            title={prev.title}
            className="nav-button nav-button-primary inline-flex items-center gap-1 text-sm"
          >
            <BackArrow />
            <span>Previous Text Topic</span>
          </Link>
        ) : (
          <span />
        )}
        {lecturePrev && (
          <Link
            href={`/${lecturePrev.slug}/`}
            title={`${lecturePrev.title} (Lecture ${lecturePrev.lec})`}
            className="nav-button inline-flex items-center gap-1 text-sm bg-violet-600 text-white hover:bg-violet-700"
          >
            <BackArrow />
            <span>
              Previous Lecture Topic
              {!lecturePrev.sameLecture && (
                <span className="opacity-75 font-normal"> · L{lecturePrev.lec}</span>
              )}
            </span>
          </Link>
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

      {/* Next buttons — two orders through the same book: the text's logical order,
          and the course's lecture order (which skips around by design) */}
      <div className="flex items-center justify-end gap-2 shrink-0">
        {lectureNext && (
          <Link
            href={`/${lectureNext.slug}/`}
            title={`${lectureNext.title} (Lecture ${lectureNext.lec})`}
            className="nav-button inline-flex items-center gap-1 text-sm bg-violet-600 text-white hover:bg-violet-700"
          >
            <span>
              Next Lecture Topic
              {!lectureNext.sameLecture && (
                <span className="opacity-75 font-normal"> · L{lectureNext.lec}</span>
              )}
            </span>
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
        )}
        {next ? (
          <Link
            href={`/${next.slug}/`}
            title={next.title}
            className="nav-button nav-button-primary inline-flex items-center gap-1 text-sm"
          >
            <span>Next Text Topic</span>
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
