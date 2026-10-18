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
  // Chapter/section are authored as meta.yaml fields (the flat content model): a topic's
  // navigation grouping travels with the file, so re-chaptering/re-sectioning is just a
  // field edit — no folder move. When absent (legacy nested layout) the scanner falls
  // back to deriving them from the folder path.
  chapter?: string;
  section?: string;
  // Only practice-set topics carry a type ("practice"); they get a full-width page.
  type?: string;
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
  type?: string;             // "practice" for practice-set topics; absent otherwise
  isSectionIntro?: boolean;  // True if this is section-level content (not a subtopic)
}

export interface NavigationItem {
  slug: string;
  title: string;
  chapter: string;
  section: string;
  type?: string;
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
