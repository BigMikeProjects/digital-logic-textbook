import { Topic, NavigationItem, NavigationContext } from '../types/content';

export interface ChapterGroup {
  id: string;
  title: string;
  sections: SectionGroup[];
}

export interface SectionGroup {
  id: string;
  title: string;
  topics: NavigationItem[];
}

export function buildNavigation(topics: Topic[]): Map<string, NavigationContext> {
  const navigation = new Map<string, NavigationContext>();

  // Build table of contents
  const toc: NavigationItem[] = topics.map(topic => ({
    slug: topic.slug,
    title: topic.title,
    chapter: topic.chapter,
    section: topic.section
  }));

  // Build navigation context for each topic
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    const current: NavigationItem = {
      slug: topic.slug,
      title: topic.title,
      chapter: topic.chapter,
      section: topic.section
    };

    const prev: NavigationItem | null = i > 0 ? {
      slug: topics[i - 1].slug,
      title: topics[i - 1].title,
      chapter: topics[i - 1].chapter,
      section: topics[i - 1].section
    } : null;

    const next: NavigationItem | null = i < topics.length - 1 ? {
      slug: topics[i + 1].slug,
      title: topics[i + 1].title,
      chapter: topics[i + 1].chapter,
      section: topics[i + 1].section
    } : null;

    navigation.set(topic.slug, {
      current,
      prev,
      next,
      toc
    });
  }

  return navigation;
}

export function buildChapterStructure(topics: Topic[]): ChapterGroup[] {
  const chapters = new Map<string, ChapterGroup>();
  // Order chapters/sections by the `order` field (not folder name), so de-numbered folder
  // names still sequence correctly. Topics arrive pre-sorted by order, so the first time we
  // see a chapter/section, that topic's order is the minimum for it.
  const chapterOrder = new Map<string, number>();
  const sectionOrder = new Map<string, number>();

  for (const topic of topics) {
    const chapterId = topic.chapter;
    const sectionId = topic.section;
    if (!chapterOrder.has(chapterId)) chapterOrder.set(chapterId, topic.order);
    const secKey = `${chapterId}||${sectionId}`;
    if (!sectionOrder.has(secKey)) sectionOrder.set(secKey, topic.order);

    // Get or create chapter
    if (!chapters.has(chapterId)) {
      chapters.set(chapterId, {
        id: chapterId,
        title: formatName(chapterId),
        sections: []
      });
    }
    const chapter = chapters.get(chapterId)!;

    // Find or create section
    let section = chapter.sections.find(s => s.id === sectionId);
    if (!section) {
      section = {
        id: sectionId,
        title: formatName(sectionId),
        topics: []
      };
      chapter.sections.push(section);
    }

    // Add topic
    section.topics.push({
      slug: topic.slug,
      title: topic.title,
      chapter: topic.chapter,
      section: topic.section
    });
  }

  // Sort chapters and sections by their `order` (derived from the topics' order field)
  const sortedChapters = Array.from(chapters.values()).sort((a, b) =>
    (chapterOrder.get(a.id) ?? 0) - (chapterOrder.get(b.id) ?? 0)
  );

  for (const chapter of sortedChapters) {
    chapter.sections.sort((a, b) =>
      (sectionOrder.get(`${chapter.id}||${a.id}`) ?? 0) - (sectionOrder.get(`${chapter.id}||${b.id}`) ?? 0)
    );
  }

  return sortedChapters;
}

function formatName(name: string): string {
  if (!name) return '';
  // Remove numeric prefix (e.g., "1.0-analog-vs-digital" -> "analog-vs-digital")
  const withoutPrefix = name.replace(/^[\d.]+[-]?/, '');
  // Replace hyphens with spaces and capitalize
  return withoutPrefix
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function getFirstTopicSlug(topics: Topic[]): string | null {
  if (topics.length === 0) return null;
  return topics[0].slug;
}
