// CI prerender: posts/*.md -> posts/*.html (full static, with OG meta) + posts.json index.
// Runs in GitHub Actions. Local devs do not need to run this; preview.html handles client-side render.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { transformAdmonitions, wrapTldrSection, readingTimeFromMarkdown } from '../src/scripts/md-transform.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const postsDir = join(root, 'posts');
const templatePath = join(postsDir, '_template.html');
const indexPath = join(root, 'posts.json');

const REQUIRED_FIELDS = ['title', 'description', 'date', 'slug', 'importance'];
const VALID_IMPORTANCE = new Set(['must-know', 'level-up', 'optional']);

function fillTemplate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in vars)) {
      throw new Error(`Template references unknown placeholder {{${key}}}`);
    }
    return vars[key];
  });
}

async function listMarkdownFiles() {
  const entries = await readdir(postsDir);
  return entries.filter((f) => f.endsWith('.md'));
}

async function prerenderOne(template, file) {
  const slug = file.replace(/\.md$/, '');
  const raw = await readFile(join(postsDir, file), 'utf8');
  const parsed = matter(raw);

  for (const field of REQUIRED_FIELDS) {
    if (!parsed.data[field]) {
      throw new Error(`${file}: missing required frontmatter field "${field}"`);
    }
  }
  if (parsed.data.slug !== slug) {
    throw new Error(`${file}: frontmatter slug "${parsed.data.slug}" does not match filename`);
  }
  if (!VALID_IMPORTANCE.has(parsed.data.importance)) {
    throw new Error(`${file}: importance "${parsed.data.importance}" is not one of ${[...VALID_IMPORTANCE].join(', ')}`);
  }

  const readingTime = parsed.data.readingTime || readingTimeFromMarkdown(parsed.content);
  const renderedBody = wrapTldrSection(transformAdmonitions(marked.parse(parsed.content)));

  const html = fillTemplate(template, {
    TITLE: escapeHtml(parsed.data.title),
    DESCRIPTION: escapeHtml(parsed.data.description),
    DATE: escapeHtml(parsed.data.date),
    READING_TIME: String(readingTime),
    SLUG: slug,
    BODY: renderedBody,
  });

  await writeFile(join(postsDir, `${slug}.html`), html, 'utf8');

  return {
    slug,
    title: parsed.data.title,
    description: parsed.data.description,
    date: parsed.data.date,
    readingTime,
    importance: parsed.data.importance,
    tags: parsed.data.tags ? String(parsed.data.tags).split(',').map((t) => t.trim()).filter(Boolean) : [],
  };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function main() {
  const template = await readFile(templatePath, 'utf8');
  const files = await listMarkdownFiles();
  if (files.length === 0) {
    console.log('No markdown posts found.');
    await writeFile(indexPath, JSON.stringify({ posts: [] }, null, 2) + '\n', 'utf8');
    return;
  }

  const entries = [];
  for (const file of files) {
    const entry = await prerenderOne(template, file);
    console.log(`prerendered: ${file} -> ${entry.slug}.html`);
    entries.push(entry);
  }
  entries.sort((a, b) => (a.date < b.date ? 1 : -1));
  await writeFile(indexPath, JSON.stringify({ posts: entries }, null, 2) + '\n', 'utf8');
  console.log(`wrote ${indexPath} with ${entries.length} entries`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
