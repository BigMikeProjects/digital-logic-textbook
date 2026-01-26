# Technical Summary: Digital Logic Textbook Platform

A lightweight, open-source interactive textbook platform built with modern web technologies.

**Live Demo:** https://bigmikeprojects.github.io/digital-logic-textbook/
**Repository:** https://github.com/BigMikeProjects/digital-logic-textbook

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 14 (React) | Static site generation, routing |
| **Styling** | Tailwind CSS | Responsive design, typography |
| **Content** | Markdown + YAML | Author-friendly format |
| **Math** | KaTeX | LaTeX equation rendering |
| **Code** | highlight.js | Syntax highlighting (Verilog, etc.) |
| **Hosting** | GitHub Pages | Free static hosting |
| **CI/CD** | GitHub Actions | Auto-deploy on push |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Content (Markdown/YAML)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ text.md     │  │ meta.yaml   │  │ graphics/   │     │
│  │ (prose)     │  │ (metadata)  │  │ images/     │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────┬───────────────────────────────┘
                          │ Build time
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Processing Pipeline                                    │
│  Markdown → remark → rehype → HTML                      │
│  (GFM, math, syntax highlighting, image path rewriting) │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Static Output (HTML/CSS/JS)                            │
│  Deployed to GitHub Pages / any static host             │
└─────────────────────────────────────────────────────────┘
```

---

## Content Structure

```
content/
└── [chapter]/
    └── [section]/
        └── [topic]/
            ├── text.md          # Main content (Markdown)
            ├── meta.yaml        # Title, description, captions
            ├── graphics/        # Side panel media
            │   ├── 01-diagram.svg
            │   ├── 02-interactive.html
            │   └── 03-video.youtube
            └── images/          # Inline images for text.md
                └── figure1.png
```

### meta.yaml Example

```yaml
title: Half Adder Basics
description: Introduction to the half adder circuit
graphics:
  01-diagram.svg:
    caption: "Half Adder Block Diagram"
  02-interactive.html:
    caption: "Interactive Circuit Simulator"
```

### Markdown Features

- GitHub Flavored Markdown (tables, task lists, etc.)
- LaTeX math: `$inline$` and `$$display$$`
- Syntax-highlighted code blocks
- Inline images: `![alt](./images/file.png)`

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Two-panel layout** | Graphics left, text right (resizable divider) |
| **Multi-format graphics** | Images, interactive HTML, YouTube embeds |
| **Inline images** | Referenced in markdown, auto-resolved paths |
| **Hierarchical navigation** | Chapter → Section → Topic |
| **Collapsible TOC** | Sidebar with chapter/section tree |
| **Code highlighting** | Including domain-specific (Verilog, VHDL) |
| **Math rendering** | LaTeX via KaTeX |
| **Responsive design** | Desktop split-view, mobile tab switching |
| **Persistent preferences** | Panel width saved to localStorage |
| **Static export** | No server required, works offline |
| **Auto-deploy** | Push to main → live in ~60 seconds |

---

## Platform Comparison

| Feature | This Platform | OpenStax | Pressbooks | Jupyter Book | Runestone |
|---------|---------------|----------|------------|--------------|-----------|
| **Content format** | Markdown | CNXML/HTML | WordPress | MyST Markdown | RST |
| **Hosting** | Self/GitHub | OpenStax.org | Self/Pressbooks | Self/GitHub | Runestone |
| **Cost** | Free | Free | Free/$$ | Free | Free |
| **Interactive graphics** | ✅ Custom HTML | Limited | Limited | ✅ Widgets | ✅ Built-in |
| **Code execution** | ❌ (extensible) | ❌ | ❌ | ✅ Jupyter | ✅ ActiveCode |
| **Student tracking/LMS** | ❌ (extensible) | ✅ | ✅ | ❌ | ✅ |
| **Offline capable** | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Version control** | ✅ Git-native | Via CNX | ❌ | ✅ Git-native | ✅ Git |
| **Customization** | Full control | Limited | Theme-based | Moderate | Moderate |
| **Vendor lock-in** | None | Moderate | Moderate | Low | Low |

### Platform Notes

**OpenStax**
- Polished, peer-reviewed, accessible textbooks
- Content locked in their ecosystem
- Limited interactivity options
- Can't easily fork and customize

**Pressbooks**
- WordPress-based, familiar editing interface
- Good for traditional book formats
- Heavier infrastructure, hosting costs for advanced features
- Less suited for technical/interactive content

**Jupyter Book**
- Closest in philosophy (Markdown + static generation)
- Excellent for computational notebooks
- Strong Python/data science ecosystem
- Less suited for multimedia-heavy content

**Runestone Academy**
- Purpose-built for CS education
- Built-in code execution, quizzes, student tracking
- Heavier infrastructure requirements
- Steeper learning curve

---

## Strengths

1. **Zero vendor lock-in** - Plain files, standard tools, fully portable
2. **Git-native workflow** - Version history, branching, collaboration via PRs
3. **Developer-friendly** - Extend with any npm package or React component
4. **AI/Agent-friendly** - Text-based formats easy for LLMs to read/write
5. **Free infrastructure** - GitHub Pages, no server costs
6. **Fast iteration** - Push to deploy in ~60 seconds
7. **Custom interactives** - Embed any HTML/JS (simulations, visualizations)
8. **Modern web performance** - Static generation, optimized assets

---

## Potential Enhancements

| Gap | Potential Solution |
|-----|-------------------|
| **Search** | Pagefind, Algolia, or Lunr.js |
| **Accessibility** | ARIA labels, screen reader testing, WCAG audit |
| **Analytics** | Plausible, Umami, or Google Analytics |
| **LMS integration** | LTI metadata or SCORM package export |
| **Student annotations** | Hypothesis integration |
| **Quizzes/assessments** | Custom component or H5P embeds |
| **PDF export** | Print styles or Puppeteer pipeline |
| **Multi-language** | i18n routing support |
| **Code execution** | WebContainers, Pyodide, or external sandboxes |

---

## Development Workflow

### For Authors (Content Only)

```bash
# Edit content files
content/01-chapter/1.1-section/1.1.1-topic/text.md

# Commit and push
git add .
git commit -m "Add new topic on XOR gates"
git push
# Site auto-deploys in ~60 seconds
```

### For Developers (Features)

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

---

## AI-Assisted Development

This platform was built in approximately 2 hours using Claude (AI coding assistant), demonstrating:

- **Rapid prototyping** - From concept to deployed site in one session
- **Low friction** - Subject-matter experts can focus on content
- **Iterative refinement** - Features added conversationally
- **Maintainability** - AI can help debug and extend later

What would typically require 2-3 days of developer time (or weeks learning a platform) was accomplished through natural language collaboration with an AI agent.

---

## Summary

> A lightweight, open-source textbook platform using modern web technologies. Content lives in plain Markdown files under version control. Supports interactive graphics, code highlighting, and math—deployed free on GitHub Pages. Unlike commercial platforms, there's no vendor lock-in. Unlike WordPress-based solutions, it's fast and developer-extensible. The entire setup was created in a few hours using an AI coding assistant, demonstrating a low-friction path for faculty to publish open educational resources.

---

## Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **KaTeX (Math):** https://katex.org/
- **GitHub Pages:** https://pages.github.com/
- **Markdown Guide:** https://www.markdownguide.org/

---

## License

This platform template is available under the MIT License. Content may be licensed separately.
