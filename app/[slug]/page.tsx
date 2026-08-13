import { notFound } from 'next/navigation';
import path from 'path';
import { loadAllTopics, buildNavigation, buildChapterStructure } from '@/lib/content';
import { loadSchedule, lectureForSlug, prettyDate } from '@/lib/content/schedule';
import { renderMarkdown } from '@/lib/markdown';
import TwoPanel from '@/components/Layout/TwoPanel';
import { TopNav } from '@/components/Navigation';
import { GraphicsPanel } from '@/components/Graphics';
import { TextPanel } from '@/components/Text';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const topics = await loadAllTopics();
  return topics.map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const topics = await loadAllTopics();
  const topic = topics.find((t) => t.slug === slug);

  if (!topic) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: `${topic.title} | Digital Logic Textbook`,
    description: topic.description,
  };
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topics = await loadAllTopics();
  const topic = topics.find((t) => t.slug === slug);

  if (!topic) {
    notFound();
  }

  const navigation = buildNavigation(topics);
  const navContext = navigation.get(slug);
  const chapters = buildChapterStructure(topics);

  if (!navContext) {
    notFound();
  }

  // Extract relative content path for image URL rewriting
  const contentDir = path.join(process.cwd(), 'content');
  const relativeContentPath = path.relative(contentDir, topic.contentPath);

  const html = await renderMarkdown(topic.markdown, relativeContentPath);

  // Course-schedule badge: where this topic falls in lecture order (if assigned)
  const lecture = lectureForSlug(loadSchedule(), slug);
  const lectureBadge = lecture
    ? {
        lec: lecture.lec,
        label:
          `Lecture ${lecture.lec}` +
          (lecture.date ? ` · ${lecture.weekday} ${prettyDate(lecture.date)}` : ''),
      }
    : null;

  return (
    <TwoPanel
      topNav={<TopNav navigation={navContext} lectureBadge={lectureBadge} />}
      graphicsPanel={<GraphicsPanel graphics={topic.graphics} />}
      textPanel={<TextPanel html={html} />}
      chapters={chapters}
      currentSlug={slug}
    />
  );
}
