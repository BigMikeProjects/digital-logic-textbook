import Link from 'next/link';
import { loadSchedule, prettyDate } from '@/lib/content/schedule';

export const metadata = {
  title: 'Course Schedule | Digital Logic Textbook',
  description: 'The course in lecture order: what we read and do for each class meeting.',
};

export default function SchedulePage() {
  const data = loadSchedule();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Digital Logic Design
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">Course Schedule</h1>
          <p className="text-gray-600 leading-relaxed">
            The book is organized as a logical reference — chapters build a subject completely.
            The <em>course</em> doesn&rsquo;t read it cover to cover: we visit topics in the order
            below, folding in new ideas as we need them, and circle back for depth later.
            Follow this page, not the chapter numbers, to stay with the class.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Links you&rsquo;ve already visited change color — an easy way to see your progress
            through the readings.
          </p>
        </div>

        {!data || data.lectures.length === 0 ? (
          <p className="text-gray-500">The schedule hasn&rsquo;t been published yet.</p>
        ) : (
          <ol className="space-y-4">
            {data.lectures.map((lecture) => {
              const milestone = lecture.items.every((i) => i.type === 'no-content');
              return (
                <li
                  key={lecture.lec}
                  className={`rounded-lg border p-4 ${
                    milestone ? 'bg-amber-50 border-amber-300' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className={`font-semibold ${milestone ? 'text-amber-800' : 'text-gray-900'}`}>
                      Lecture {lecture.lec}
                    </span>
                    {lecture.date && (
                      <span className="text-sm text-gray-500">
                        {lecture.weekday} {prettyDate(lecture.date)}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1">
                    {lecture.items.map((item, i) => (
                      <li key={i} className="text-sm">
                        {item.type === 'no-content' ? (
                          <span className="font-semibold text-amber-800">{item.title}</span>
                        ) : item.published && item.slug ? (
                          <>
                            <span className="text-gray-400 font-mono text-xs mr-2">{item.num}</span>
                            <Link href={`/${item.slug}/`} className="schedule-link text-blue-700 hover:underline">
                              {item.title}
                            </Link>
                          </>
                        ) : (
                          <>
                            <span className="text-gray-400 font-mono text-xs mr-2">{item.num}</span>
                            <span className="text-gray-400">{item.title} (coming soon)</span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
