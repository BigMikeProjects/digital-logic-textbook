import fs from 'fs';
import path from 'path';
import { Topic } from '../types/content';
import { parseTopicContent } from './parser';
import { findAndSortGraphics } from './graphics';

const CONTENT_DIR = path.join(process.cwd(), 'content');

interface FolderInfo {
  path: string;
  name: string;
  chapter: string;
  section: string;
  isSectionIntro: boolean;
}

function extractChapterAndSection(folderPath: string): { chapter: string; section: string; isSectionIntro: boolean } {
  const relativePath = path.relative(CONTENT_DIR, folderPath);
  const parts = relativePath.split(path.sep);

  // Depth 2 = section-level content (chapter/section/text.md)
  // Depth 3 = topic-level content (chapter/section/topic/text.md)
  const depth = parts.length;

  if (depth === 2) {
    // Section-level content: chapter/section
    return {
      chapter: parts[0] || '',
      section: parts[1] || '',
      isSectionIntro: true
    };
  }

  // Topic-level content: chapter/section/topic
  return {
    chapter: parts[0] || '',
    section: parts[1] || '',
    isSectionIntro: false
  };
}

function findTopicFolders(dir: string, folders: FolderInfo[] = []): FolderInfo[] {
  if (!fs.existsSync(dir)) {
    return folders;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // Check if this directory is a topic folder (has text.md)
  const hasTextMd = entries.some(e => e.isFile() && e.name === 'text.md');

  if (hasTextMd) {
    const { chapter, section, isSectionIntro } = extractChapterAndSection(dir);
    folders.push({
      path: dir,
      name: path.basename(dir),
      chapter,
      section,
      isSectionIntro
    });
  }

  // Recursively scan subdirectories
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      findTopicFolders(path.join(dir, entry.name), folders);
    }
  }

  return folders;
}

function sortFolders(folders: FolderInfo[]): FolderInfo[] {
  return folders.sort((a, b) => {
    // Sort by full path to maintain chapter/section/topic order
    return a.path.localeCompare(b.path, undefined, { numeric: true });
  });
}

export function scanContentFolders(): FolderInfo[] {
  const folders = findTopicFolders(CONTENT_DIR);
  return sortFolders(folders);
}

export async function loadAllTopics(): Promise<Topic[]> {
  const folders = scanContentFolders();
  const topics: Topic[] = [];

  for (const folder of folders) {
    try {
      const { meta, markdown } = parseTopicContent(folder.path);
      const graphics = findAndSortGraphics(folder.path, meta.graphics);

      // Generate slug from folder name
      const slug = folder.name;

      topics.push({
        slug,
        title: meta.title || folder.name,
        description: meta.description,
        order: meta.order || 0,
        contentPath: folder.path,
        markdown,
        graphics,
        chapter: folder.chapter,
        section: folder.section,
        isSectionIntro: folder.isSectionIntro
      });
    } catch (error) {
      console.error(`Error loading topic from ${folder.path}:`, error);
    }
  }

  return topics;
}

export function getAllSlugs(): string[] {
  const folders = scanContentFolders();
  return folders.map(f => f.name);
}
