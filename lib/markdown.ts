import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import verilog from 'highlight.js/lib/languages/verilog';

export async function renderMarkdown(content: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight, {
      detect: true,
      languages: {
        verilog: verilog
      }
    })
    .use(rehypeStringify)
    .process(content);

  return result.toString();
}
