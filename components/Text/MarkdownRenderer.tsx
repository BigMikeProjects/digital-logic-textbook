interface MarkdownRendererProps {
  html: string;
}

export default function MarkdownRenderer({ html }: MarkdownRendererProps) {
  return (
    <div
      className="prose prose-slate max-w-none
        [&_pre]:text-gray-800 [&_pre_code]:text-inherit [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:rounded-none
        [&_pre]:font-mono [&_code]:font-mono"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
