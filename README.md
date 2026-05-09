<!-- TODO: one day consider stylized SVG title headers instead of plain markdown headings -->

<img src="assets/images/favicon.png" width="48" alt="project icon" />

# SirBepy Blog

> Notes on AI, vibecoding, and building things from scratch.

**Live:** https://sirbepy.github.io/sirbepy_blog/

---

## About

A personal blog where SirBepy documents findings on AI-assisted development, vibecoding workflows, and lessons learned building projects. Written for beginners getting into AI-powered coding.

---

## How to run locally

You need a static server because the page uses `fetch()` and ES modules. `file://` won't work.

**Option 1: VS Code Live Server (easiest)**

1. Open VS Code on the **project root** (the folder containing `index.html`), not on a subfolder.
2. Click "Go Live" in the status bar, OR right-click `index.html` and pick "Open with Live Server".
3. Browser opens at `http://127.0.0.1:5500/`. Click a post card.

The repo includes `.vscode/settings.json` pinning Live Server's root to the workspace, so paths always resolve correctly.

**Option 2: Python**

```
python -m http.server 8080
```

Open `http://localhost:8080/`.

**Option 3: One-shot npx**

```
npx --yes serve .
```

## How posts are built

- Local preview: open `posts/<slug>.html` (committed client-side stub) or `posts/preview.html?slug=<slug>`. Both fetch the `.md` and render in browser.
- CI (push to master): GitHub Actions runs `node scripts/prerender.mjs` to generate static `posts/<slug>.html` (with proper OG meta) plus `posts.json` for the homepage list, then deploys to GitHub Pages.

---

## Project write-up

See [PORTFOLIO.md](.portfolio-data/PORTFOLIO.md) for the full project write-up.
