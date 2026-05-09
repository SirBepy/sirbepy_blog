<!-- TODO: one day consider stylized SVG title headers instead of plain markdown headings -->

<img src="assets/images/favicon.png" width="48" alt="project icon" />

# SirBepy Blog

> Notes on AI, vibecoding, and building things from scratch.

**Live:** https://sirbepy.github.io/sirbepy_blog/

---

## About

A personal blog where SirBepy documents findings on AI-assisted development, vibecoding workflows, and lessons learned building projects. Written for beginners getting into AI-powered coding.

---

## How to run

Open `index.html` in a browser. No build step, no npm needed for local dev.

Preview a post locally: `posts/preview.html?slug=<slug>`. The page fetches the matching `.md` file and renders it client-side.

CI runs `node scripts/prerender.mjs` on push to master to generate static `posts/<slug>.html` files (with proper Open Graph meta) plus `posts.json` for the homepage list.

---

## Project write-up

See [PORTFOLIO.md](.portfolio-data/PORTFOLIO.md) for the full project write-up.
