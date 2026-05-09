// Regenerates posts/*.html "loader stubs" from posts/*.md frontmatter.
// Stubs use viewer.js to render markdown client-side. CI prerender (prerender.mjs)
// overwrites these with real static HTML on deploy. Run locally whenever the
// shell HTML changes (e.g. new <script>, layout tweak) so all posts stay in sync.
//
// Usage: node scripts/regen-stubs.mjs

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const postsDir = resolve(here, '..', 'posts');

function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return {};
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return {};
  const block = raw.slice(3, end).trim();
  const data = {};
  for (const line of block.split('\n')) {
    const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    data[m[1]] = v;
  }
  return data;
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stubHtml({ title, description, slug }) {
  const t = escHtml(title);
  const d = escHtml(description);
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${t} - SirBepy Blog</title>
    <link rel="icon" type="image/x-icon" href="../favicon.ico" />
    <link rel="icon" type="image/png" href="../assets/images/favicon.png" />
    <link rel="icon" type="image/svg+xml" href="../assets/images/favicon.svg" />
    <meta name="description" content="${d}" />
    <meta property="og:title" content="${t}" />
    <meta property="og:description" content="${d}" />
    <meta property="og:image" content="../assets/images/favicon.png" />
    <meta property="og:url" content="https://sirbepy.github.io/sirbepy_blog/posts/${slug}.html" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sirbepy/bepy-project-init@main/styleguide.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.css" />
    <link rel="stylesheet" href="../src/styles/styles.css" />
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
  </head>
  <body>
    <main class="post-page">
      <nav class="post-nav-top">
        <a href="../index.html" class="back-link">
          <i class="ph ph-arrow-left"></i>
          <span>All posts</span>
        </a>
      </nav>

      <div class="post-layout">
        <article class="post" id="post-root">
          <p class="post-loading">Loading post...</p>
        </article>
        <aside class="post-toc" id="post-toc"></aside>
      </div>
    </main>

    <script>window.__POST_SLUG = '${slug}';</script>
    <script src="https://cdn.jsdelivr.net/npm/marked@14.1.3/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js"></script>
    <script type="module" src="../src/scripts/viewer.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/sirbepy/bepy-project-init@main/widget/settings.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/sirbepy/bepy-project-init@main/widget/background.js"></script>
  </body>
</html>
`;
}

async function main() {
  const files = (await readdir(postsDir)).filter((f) => f.endsWith('.md'));
  let written = 0;
  for (const file of files) {
    const raw = await readFile(join(postsDir, file), 'utf8');
    const data = parseFrontmatter(raw);
    const slug = file.replace(/\.md$/, '');
    if (!data.title || !data.description || data.slug !== slug) {
      console.warn(`skipping ${file}: missing/mismatched frontmatter`);
      continue;
    }
    await writeFile(join(postsDir, `${slug}.html`), stubHtml({ title: data.title, description: data.description, slug }), 'utf8');
    console.log(`wrote ${slug}.html`);
    written++;
  }
  console.log(`done: ${written} stub(s) written`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
