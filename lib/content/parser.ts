import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { TopicMeta } from '../types/content';

export function parseTopicContent(topicPath: string): { meta: TopicMeta; markdown: string } {
  const textPath = path.join(topicPath, 'text.md');
  const metaPath = path.join(topicPath, 'meta.yaml');

  // Read markdown content
  let markdown = '';
  if (fs.existsSync(textPath)) {
    markdown = fs.readFileSync(textPath, 'utf-8');
  }

  // Read and parse meta.yaml
  let meta: TopicMeta = { title: path.basename(topicPath) };
  if (fs.existsSync(metaPath)) {
    try {
      const metaContent = fs.readFileSync(metaPath, 'utf-8');
      const parsed = yaml.load(metaContent) as TopicMeta;
      if (parsed) {
        meta = { ...meta, ...parsed };
      }
    } catch (error) {
      console.error(`Error parsing meta.yaml at ${metaPath}:`, error);
    }
  }

  // If no title in meta.yaml, try to extract from markdown H1
  if (!meta.title || meta.title === path.basename(topicPath)) {
    const h1Match = markdown.match(/^#\s+(.+)$/m);
    if (h1Match) {
      meta.title = h1Match[1];
    }
  }

  return { meta, markdown };
}
