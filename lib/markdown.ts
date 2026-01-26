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

/**
 * Rehype plugin to rewrite relative image paths to absolute content paths.
 * Transforms ./images/file.png to /content/[chapter]/[section]/[topic]/images/file.png
 */
function rehypeRewriteImagePaths(contentPath: string) {
  return () => (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'img' && node.properties?.src) {
        const src = node.properties.src as string;
        // Only rewrite relative paths starting with ./
        if (src.startsWith('./')) {
          node.properties.src = `/content/${contentPath}/${src.slice(2)}`;
        }
      }
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
    .use(rehypeStringify)
    .process(content);

  return result.toString();
}
