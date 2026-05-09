## Project

Type: html (markdown-sourced posts, prerendered in CI)
Deploy: github-pages

## Structure

```
index.html                   homepage shell (lists posts from posts.json)
posts/
  *.md                       source of truth for each post (frontmatter + body)
  *.html                     generated in CI by scripts/prerender.mjs (DO NOT edit by hand)
  preview.html               local dev viewer: open posts/preview.html?slug=<slug>
  _template.html             template consumed by prerender (not served)
posts.json                   generated index of posts (frontmatter snapshots)
src/
  scripts/
    viewer.js                client-side MD renderer used by preview.html
    index.js                 homepage list renderer (fetches posts.json)
    md-transform.js          GFM admonitions -> .card transform (browser+node compatible)
  styles/styles.css          project-level overrides
scripts/
  prerender.mjs              CI: posts/*.md -> posts/*.html + posts.json
package.json                 deps for CI only (marked, gray-matter)
assets/images/               favicon etc.
.github/workflows/deploy.yml runs prerender then publishes to GitHub Pages
```

## Rules

- Local dev: no npm needed. `posts/preview.html?slug=<slug>` renders a post in the browser using viewer.js.
- CI dev: GitHub Actions runs `node scripts/prerender.mjs` to generate static `posts/[slug].html` (with proper OG meta) and `posts.json` before deploy.
- Each post is a markdown file under `posts/`. Frontmatter required: `title`, `description`, `date` (YYYY-MM-DD), `slug` (matches filename), `readingTime`, `importance` (one of `must-know` / `level-up` / `optional`).
- Callouts use GFM admonitions (`> [!tip] Title`, `> [!warning] Title`). Renderer transforms them into `.card.card-tip`, `.card.card-warning`, etc.
- CSS vars from styleguide CDN, never hardcode colors.
- MUST have favicon.svg + favicon.png + favicon.ico in assets/images/.
- Posts ship as both `.md` (downloadable, obsidian-friendly) and `.html` (prerendered) at the same URL stem.

## Adding a post

1. Write `posts/<slug>.md` with frontmatter + body. Use `> [!tip]` style for callouts.
2. Add an entry to `posts.json` (or let CI regenerate it).
3. Local preview: `posts/preview.html?slug=<slug>`.
4. Push to master. CI prerenders + deploys.
