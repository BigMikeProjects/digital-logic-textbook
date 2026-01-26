'use client';

import { GraphicItem } from '@/lib/types/content';
import ImageViewer from './ImageViewer';
import YouTubeEmbed from './YouTubeEmbed';
import HtmlPreview from './HtmlPreview';

interface GraphicViewerProps {
  graphic: GraphicItem;
}

export default function GraphicViewer({ graphic }: GraphicViewerProps) {
  switch (graphic.type) {
    case 'image':
      return <ImageViewer src={graphic.path} alt={graphic.caption || graphic.filename} />;
    case 'youtube':
      return <YouTubeEmbed videoId={graphic.youtubeId || ''} startTime={graphic.startTime} />;
    case 'html':
      return <HtmlPreview src={graphic.path} title={graphic.caption || graphic.filename} />;
    default:
      return (
        <div className="text-gray-400 text-center">
          Unsupported graphic type: {graphic.type}
        </div>
      );
  }
}
