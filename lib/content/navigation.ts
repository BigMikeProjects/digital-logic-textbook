import { Topic, NavigationItem, NavigationContext } from '../types/content';

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

export function getFirstTopicSlug(topics: Topic[]): string | null {
  if (topics.length === 0) return null;
  return topics[0].slug;
}
