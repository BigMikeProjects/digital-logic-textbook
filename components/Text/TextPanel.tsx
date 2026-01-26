import MarkdownRenderer from './MarkdownRenderer';

interface TextPanelProps {
  html: string;
}

export default function TextPanel({ html }: TextPanelProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 lg:p-8">
        <MarkdownRenderer html={html} />
      </div>
    </div>
  );
}
