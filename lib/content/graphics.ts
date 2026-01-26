import fs from 'fs';
import path from 'path';
import { GraphicItem } from '../types/content';

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
const HTML_EXTENSION = '.html';
const YOUTUBE_EXTENSION = '.youtube';

export function getGraphicType(filename: string): 'image' | 'youtube' | 'html' | null {
  const ext = path.extname(filename).toLowerCase();

  if (IMAGE_EXTENSIONS.includes(ext)) {
    return 'image';
  }
  if (ext === HTML_EXTENSION) {
    return 'html';
  }
  if (ext === YOUTUBE_EXTENSION) {
    return 'youtube';
  }
  return null;
}

export function extractYoutubeId(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    // Handle both full URLs and just video IDs
    const urlMatch = content.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (urlMatch) {
      return urlMatch[1];
    }
    // Assume it's a raw video ID
    return content;
  } catch {
    return '';
  }
}

export function findAndSortGraphics(
  topicPath: string,
  metaGraphics?: Record<string, { caption?: string }>
): GraphicItem[] {
  const graphics: GraphicItem[] = [];

  if (!fs.existsSync(topicPath)) {
    return graphics;
  }

  const entries = fs.readdirSync(topicPath, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile()) continue;

    const type = getGraphicType(entry.name);
    if (!type) continue;

    // Skip text.md and meta.yaml
    if (entry.name === 'text.md' || entry.name === 'meta.yaml') continue;

    const graphic: GraphicItem = {
      filename: entry.name,
      type,
      path: `/content/${path.relative(path.join(process.cwd(), 'content'), topicPath)}/${entry.name}`,
    };

    // Add caption from meta.yaml if available
    if (metaGraphics && metaGraphics[entry.name]) {
      graphic.caption = metaGraphics[entry.name].caption;
    }

    // Extract YouTube ID if applicable
    if (type === 'youtube') {
      graphic.youtubeId = extractYoutubeId(path.join(topicPath, entry.name));
    }

    graphics.push(graphic);
  }

  // Sort by filename prefix (assumes numeric prefix like 01-, 02-, etc.)
  return graphics.sort((a, b) => {
    return a.filename.localeCompare(b.filename, undefined, { numeric: true });
  });
}
