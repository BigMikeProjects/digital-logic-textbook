import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import verilog from 'highlight.js/lib/languages/verilog';
import type { Root, Element } from 'hast';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * Rehype plugin to rewrite relative image paths to absolute content paths.
 * Transforms ./images/file.png to [basePath]/content/[chapter]/[section]/[topic]/images/file.png
 */
function rehypeRewriteImagePaths(contentPath: string) {
  return () => (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'img' && node.properties?.src) {
        const src = node.properties.src as string;
        // Only rewrite relative paths starting with ./
        if (src.startsWith('./')) {
          node.properties.src = `${basePath}/content/${contentPath}/${src.slice(2)}`;
        }
      }
    });
  };
}

/**
 * Rehype plugin to wrap every table in a horizontally scrollable div.
 *
 * Tables are sized to their content now, so most are narrower than the prose column — but a
 * wide one (many columns, or long cells) must scroll inside its own box rather than pushing
 * the page sideways on a narrow screen.
 */
function rehypeWrapTables() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'table' || !parent || index === undefined) return;
      const p = parent as Element;
      if (p.tagName === 'div' && (p.properties?.className as string[] | undefined)?.includes('table-wrap')) return;
      const wrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-wrap'] },
        children: [node],
      };
      p.children[index] = wrapper;
    });
  };
}

export async function renderMarkdown(content: string, contentPath?: string): Promise<string> {
  let processor = remark()
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeHighlight, {
      detect: true,
      languages: {
        verilog: verilog
      }
    });

  // Add image path rewriting if contentPath is provided
  if (contentPath) {
    processor = processor.use(rehypeRewriteImagePaths(contentPath));
  }

  const result = await processor
    .use(rehypeWrapTables)
    .use(rehypeStringify)
    .process(content);

  return result.toString();
}
