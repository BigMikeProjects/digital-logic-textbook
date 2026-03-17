# Developer Notes for Digital Logic Textbook

## Project Overview

Interactive digital logic textbook built with Next.js 14, deployed to GitHub Pages.

**Live Site:** https://bigmikeprojects.github.io/digital-logic-textbook/
**Repository:** https://github.com/BigMikeProjects/digital-logic-textbook

## Quick Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Build for production (runs copy-assets first)
git push         # Auto-deploys to GitHub Pages via GitHub Actions
```

## Project Structure

```
├── app/                    # Next.js app router
├── components/
│   ├── Graphics/           # GraphicsPanel, YouTubeEmbed, ImageViewer, HtmlPreview
│   ├── Layout/             # SplitPane, ResizableLayout
│   ├── Navigation/         # TOC, navigation components
│   └── Text/               # Markdown rendering
├── lib/
│   ├── content/            # Content processing (scanner, parser, graphics, navigation)
│   ├── types/              # TypeScript interfaces (content.ts)
│   └── markdown.ts         # Markdown-to-HTML pipeline
├── content/                # ALL TEXTBOOK CONTENT LIVES HERE
│   └── [chapter]/
│       └── [section]/
│           └── [topic]/
│               ├── text.md
│               ├── meta.yaml
│               ├── graphics/   # Side panel media (01-*.svg, 02-*.html, 03-*.youtube)
│               └── images/     # Inline images referenced in text.md
└── public/content/         # Copied from content/ at build time
```

## Content Pipeline

New content is authored in the pipeline repo (`../pipeline/`) and published here via `publish.ts`. See `../pipeline/CLAUDE.md` for the full authoring workflow.

**Publish flow:**
1. Content is written in `pipeline/topics/NN-slug/content/v01.md`
2. `publish.ts` copies it to `content/[chapter]/[section]/[topic-slug]/text.md` along with graphics, images, and meta.yaml
3. Build with `npm run build`, then commit and push to deploy

## Content Authoring

### Adding a New Topic

1. Create folder: `content/[chapter]/[section]/[topic-slug]/`
2. Add `text.md` with markdown content
3. Add `meta.yaml`:
   ```yaml
   title: "Topic Title"
   description: "Brief description"
   order: 1  # Controls sort order within section

   graphics:
     01-diagram.svg:
       caption: "Description shown below graphic"
   ```
4. Add graphics to `graphics/` folder (prefix with numbers for ordering)

### Supported Graphic Types

| Extension | Type | Notes |
|-----------|------|-------|
| `.svg`, `.png`, `.jpg`, `.gif`, `.webp` | Image | Displayed in ImageViewer |
| `.html` | Interactive | Embedded in iframe (HtmlPreview) |
| `.youtube` | Video | Contains video ID or URL |

### YouTube File Format

```
# Just video ID
dQw4w9WgXcQ

# With timestamp (starts at 45 seconds)
dQw4w9WgXcQ?t=45

# Full URL with timestamp
https://youtu.be/dQw4w9WgXcQ?t=120
```

### Inline Images in Markdown

Reference images in `images/` subfolder:
```markdown
![Alt text](./images/filename.svg)
```

### Markdown Features

- GitHub Flavored Markdown (tables, task lists)
- LaTeX math: `$inline$` and `$$display$$`
- Syntax highlighting: ` ```verilog `, ` ```python `, etc.

### Review Questions Format

Multiple choice questions should:
- Focus on digital logic concepts (noise margin, thresholds, tradeoffs, etc.)
- Have 4 answer choices (A, B, C, D)
- Randomize correct answer positions (avoid patterns like all B's)
- Include an "Answer Explanations" section that:
  - States the correct answer
  - Explains why it's correct (tie back to concepts in the text)
  - Explains why each wrong answer is incorrect

Example format:
```markdown
## Review Questions

**1. Question text here?**

- A) First option
- B) Second option
- C) Third option
- D) Fourth option

---

## Answer Explanations

**1. Answer: B) Second option**

Explanation of why B is correct.

- *First option* (A) is wrong because...
- *Third option* (C) is wrong because...
- *Fourth option* (D) is wrong because...
```

## Key Files for Common Changes

| Task | Files to Modify |
|------|-----------------|
| Add new graphic type | `lib/content/graphics.ts`, `lib/types/content.ts`, new component in `components/Graphics/` |
| Modify YouTube embed | `components/Graphics/YouTubeEmbed.tsx` |
| Change markdown processing | `lib/markdown.ts` |
| Modify navigation | `lib/content/navigation.ts`, `components/Navigation/` |
| Add new content type field | `lib/types/content.ts`, `lib/content/parser.ts` |

## TypeScript Interfaces

### GraphicItem (lib/types/content.ts)
```typescript
interface GraphicItem {
  filename: string;
  type: 'image' | 'youtube' | 'html';
  path: string;
  caption?: string;
  youtubeId?: string;     // For youtube type
  startTime?: number;     // YouTube start time in seconds
}
```

### Topic (lib/types/content.ts)
```typescript
interface Topic {
  slug: string;
  title: string;
  description?: string;
  order: number;
  contentPath: string;
  markdown: string;
  graphics: GraphicItem[];
  chapter: string;
  section: string;
}
```

## Testing Changes

1. Run `npm run dev`
2. Navigate to a topic with the modified content type
3. Verify rendering in browser
4. Run `npx tsc --noEmit` to check for type errors
5. Test `npm run build` before pushing

## Deployment

Push to `main` branch triggers GitHub Actions workflow:
1. Runs `npm run build`
2. Exports static files
3. Deploys to GitHub Pages

Site updates in ~60 seconds after push.

## Gotchas

- **Asset copying**: Graphics/images must be copied to `public/content/` at build time (handled by `scripts/copy-content-assets.ts`)
- **basePath**: Site runs at `/digital-logic-textbook/` on GitHub Pages; asset paths account for this in `next.config.js`
- **Static export**: No server-side features; everything is statically generated
