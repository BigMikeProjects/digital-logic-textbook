export interface GraphicItem {
  filename: string;
  type: 'image' | 'youtube' | 'html';
  path: string;
  caption?: string;
  youtubeId?: string;
  startTime?: number;
}

export interface TopicMeta {
  title: string;
  description?: string;
  order?: number;
  graphics?: Record<string, { caption?: string }>;
}

export interface Topic {
  slug: string;
  title: string;
  description?: string;
  order: number;
  contentPath: string;
  markdown: string;
  graphics: GraphicItem[];
  chapter: string;
  section: string;
  isSectionIntro?: boolean;  // True if this is section-level content (not a subtopic)
}

export interface NavigationItem {
  slug: string;
  title: string;
  chapter: string;
  section: string;
}

export interface NavigationContext {
  current: NavigationItem;
  prev: NavigationItem | null;
  next: NavigationItem | null;
  toc: NavigationItem[];
}

export interface ContentIndex {
  topics: Topic[];
  navigation: Map<string, NavigationContext>;
}
