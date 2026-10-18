import { GraphicItem } from '@/lib/types/content';
import HtmlPreview from './HtmlPreview';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface PracticePanelProps {
  graphics: GraphicItem[];
  title: string;
}

// A practice-set topic's page leads with its interactive problem set at full width.
// The 16:9 frame is capped so it never runs taller than the window below the top nav.
export default function PracticePanel({ graphics, title }: PracticePanelProps) {
  const set = graphics.find((g) => g.type === 'html');
  if (!set) return null;
  return (
    <div className="practice-stage">
      <div className="practice-frame">
        <HtmlPreview src={set.path} title={title} overlayButton={false} />
      </div>
      <div className="practice-caption">
        {set.caption && <p>{set.caption}</p>}
        <a href={`${basePath}${set.path}`} target="_blank" rel="noopener" className="practice-full">Open full screen &#8599;</a>
      </div>
    </div>
  );
}
