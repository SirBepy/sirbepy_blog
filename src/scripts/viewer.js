// Local-dev MD viewer. Used by posts/preview.html.
// Production posts are prerendered to HTML in CI; this file is not loaded there.

import { transformAdmonitions, readingTimeFromMarkdown } from './md-transform.js';

const SLUG_PARAM = 'slug';

function parseFrontmatter(raw) {
  // Minimal YAML-ish parser. Supports `key: value` only (no arrays/nested).
  if (!raw.startsWith('---')) return { data: {}, content: raw };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { data: {}, content: raw };
  const block = raw.slice(3, end).trim();
  const content = raw.slice(end + 4).replace(/^\r?\n/, '');
  const data = {};
  for (const line of block.split('\n')) {
    const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[m[1]] = value;
  }
  return { data, content };
}

function getSlug() {
  if (typeof window.__POST_SLUG === 'string' && window.__POST_SLUG) {
    return window.__POST_SLUG;
  }
  const params = new URLSearchParams(window.location.search);
  return params.get(SLUG_PARAM);
}

function renderError(root, message) {
  root.innerHTML = `
    <div class="card card-admonition card-warning">
      <div class="card-admonition-header">
        <i class="ph ph-warning"></i>
        <span class="card-admonition-title">Could not load post</span>
      </div>
      <div class="card-admonition-body"><p>${message}</p></div>
    </div>
  `;
}

async function loadAndRender() {
  const root = document.getElementById('post-root');
  if (!root) return;

  const slug = getSlug();
  if (!slug) {
    renderError(root, 'Missing <code>?slug=...</code> in URL. Try <code>preview.html?slug=how-claude-code-works</code>.');
    return;
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    renderError(root, 'Invalid slug. Use lowercase letters, numbers, and hyphens only.');
    return;
  }

  let raw;
  try {
    const res = await fetch(`./${slug}.md`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    raw = await res.text();
  } catch (err) {
    renderError(root, `Could not fetch <code>${slug}.md</code>: ${err.message}`);
    return;
  }

  const { data, content } = parseFrontmatter(raw);
  const title = data.title || slug;
  const description = data.description || '';
  const date = data.date || '';
  const readingTime = data.readingTime || readingTimeFromMarkdown(content);

  document.title = `${title} - SirBepy Blog`;

  const renderedBody = transformAdmonitions(window.marked.parse(content));

  root.innerHTML = `
    <header class="post-header">
      <h1>${title}</h1>
      ${description ? `<p class="post-subtitle">${description}</p>` : ''}
      <div class="post-meta">
        ${date ? `<span class="post-date"><i class="ph ph-calendar-blank"></i> ${date}</span>` : ''}
        <span class="post-reading-time"><i class="ph ph-clock"></i> ${readingTime} min read</span>
      </div>
    </header>
    <div class="post-body">${renderedBody}</div>
    <footer class="post-footer">
      <a href="../index.html" class="back-link">
        <i class="ph ph-arrow-left"></i>
        <span>Back to all posts</span>
      </a>
      <a href="./${slug}.md" class="download-link" title="Download as Markdown">
        <i class="ph ph-download-simple"></i>
        <span>Download .md</span>
      </a>
    </footer>
  `;

  if (window.Prism && window.Prism.highlightAll) {
    window.Prism.highlightAll();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAndRender);
} else {
  loadAndRender();
}
