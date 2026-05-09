// Runtime enhancements for rendered post pages: side TOC, copy buttons, scroll progress.
// Loaded by both prerendered template and the local preview viewer.

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function ensureUniqueId(el, used) {
  let base = el.id || slugify(el.textContent || '') || 'section';
  let id = base;
  let n = 1;
  while (used.has(id) || (id !== base && document.getElementById(id))) {
    id = `${base}-${n++}`;
  }
  used.add(id);
  el.id = id;
  return id;
}

function smoothScrollTo(target) {
  if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
    window.__lenis.scrollTo(target, { offset: -16 });
  } else if (target instanceof Element) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function buildToc(body, tocRoot) {
  if (!tocRoot) return [];
  const allHeadings = body.querySelectorAll('h2, h3');
  const headings = Array.from(allHeadings).filter(
    (h) => !/^TL;?\s*DR/i.test(h.textContent.trim())
  );
  if (headings.length === 0) {
    tocRoot.style.display = 'none';
    return [];
  }
  const used = new Set();
  const ol = document.createElement('ol');
  const items = [];
  headings.forEach((h) => {
    const id = ensureUniqueId(h, used);
    const li = document.createElement('li');
    li.className = h.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = h.textContent;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollTo(h);
      history.replaceState(null, '', `#${id}`);
    });
    li.appendChild(a);
    ol.appendChild(li);
    items.push({ heading: h, link: a });
  });

  tocRoot.innerHTML = '';
  const title = document.createElement('p');
  title.className = 'post-toc-title';
  title.textContent = 'In this post';
  tocRoot.appendChild(title);

  const indicator = document.createElement('span');
  indicator.className = 'post-toc-indicator';
  ol.appendChild(indicator);
  tocRoot.appendChild(ol);

  const progress = document.createElement('div');
  progress.className = 'post-toc-progress';
  const bar = document.createElement('div');
  bar.className = 'post-toc-progress-bar';
  progress.appendChild(bar);
  tocRoot.appendChild(progress);

  return { items, bar, indicator };
}

function setActive(items, activeSet, indicator) {
  let firstLink = null;
  let lastLink = null;
  items.forEach(({ heading, link }) => {
    const isActive = activeSet.has(heading);
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      if (!firstLink) firstLink = link;
      lastLink = link;
    }
  });
  if (indicator) {
    if (firstLink) {
      const top = firstLink.offsetTop;
      const bottom = lastLink.offsetTop + lastLink.offsetHeight;
      indicator.style.top = `${top}px`;
      indicator.style.height = `${bottom - top}px`;
      indicator.classList.add('is-visible');
    } else {
      indicator.classList.remove('is-visible');
    }
  }
}

function wireScrollSpy(items, bar, indicator) {
  if (!items.length) return;

  const postBody = document.querySelector('.post-body');

  function update() {
    const scrollTop = window.scrollY;
    const vh = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const docH = docHeight - vh;

    // Last section ends where post body content ends (ignore footer/back-link area).
    const lastSectionBottom = postBody
      ? postBody.getBoundingClientRect().bottom + scrollTop
      : docHeight;

    const headingTops = items.map(({ heading }) => heading.getBoundingClientRect().top + scrollTop);

    const active = new Set();
    items.forEach(({ heading }, i) => {
      const top = headingTops[i];
      const bottom = headingTops[i + 1] !== undefined ? headingTops[i + 1] : lastSectionBottom;
      if (top >= scrollTop && bottom <= scrollTop + vh) active.add(heading);
    });

    if (active.size === 0) {
      const pivot = scrollTop + vh * 0.3;
      let latest = items[0].heading;
      items.forEach(({ heading }, i) => {
        if (headingTops[i] <= pivot) latest = heading;
      });
      active.add(latest);
    }

    setActive(items, active, indicator);

    if (bar) {
      const pct = docH > 0 ? Math.min(100, Math.max(0, (scrollTop / docH) * 100)) : 0;
      bar.style.width = `${pct}%`;
    }
    document.body.classList.toggle('is-scrolled-top', scrollTop > 30);
    document.body.classList.toggle('is-scrolled-bottom', scrollTop < docH - 30);
  }

  let raf = 0;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      update();
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

function addLineNumbersClass(body) {
  body.querySelectorAll('pre').forEach((pre) => {
    if (!pre.classList.contains('line-numbers')) pre.classList.add('line-numbers');
  });
}

function addCopyButtons(body) {
  body.querySelectorAll('pre').forEach((pre) => {
    if (pre.querySelector(':scope > .code-copy')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy';
    btn.setAttribute('aria-label', 'Copy code');
    btn.innerHTML = '<i class="ph ph-copy"></i><span>Copy</span>';
    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      const text = code ? code.innerText : pre.innerText;
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add('is-copied');
        btn.innerHTML = '<i class="ph ph-check"></i><span>Copied</span>';
        setTimeout(() => {
          btn.classList.remove('is-copied');
          btn.innerHTML = '<i class="ph ph-copy"></i><span>Copy</span>';
        }, 1400);
      } catch {
        btn.textContent = 'Failed';
      }
    });
    pre.appendChild(btn);
  });
}

function getCurrentSlug() {
  if (typeof window.__POST_SLUG === 'string' && window.__POST_SLUG) return window.__POST_SLUG;
  const m = location.pathname.match(/\/posts\/([^\/]+)\.html$/);
  if (m) return m[1];
  const params = new URLSearchParams(location.search);
  return params.get('slug');
}

async function fetchRelated(currentSlug) {
  try {
    const res = await fetch('../posts.json', { cache: 'no-cache' });
    if (!res.ok) return [];
    const data = await res.json();
    const posts = Array.isArray(data.posts) ? data.posts : [];
    const current = posts.find((p) => p.slug === currentSlug);
    if (!current) return [];
    const tags = (current.tags || []).map((t) => String(t).toLowerCase());
    if (tags.length === 0) return [];
    return posts
      .filter((p) => p.slug !== currentSlug)
      .map((p) => {
        const pTags = (p.tags || []).map((t) => String(t).toLowerCase());
        const score = pTags.filter((t) => tags.includes(t)).length;
        return { ...p, score };
      })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score || (a.date < b.date ? 1 : -1))
      .slice(0, 3);
  } catch {
    return [];
  }
}

async function renderRelated(tocRoot) {
  if (!tocRoot) return;
  const slug = getCurrentSlug();
  if (!slug) return;
  const related = await fetchRelated(slug);
  if (related.length === 0) return;

  const section = document.createElement('div');
  section.className = 'post-related';

  const title = document.createElement('p');
  title.className = 'post-toc-title';
  title.textContent = 'Also read';
  section.appendChild(title);

  const ul = document.createElement('ul');
  related.forEach((p) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `./${p.slug}.html`;
    a.textContent = p.title;
    li.appendChild(a);
    ul.appendChild(li);
  });
  section.appendChild(ul);
  tocRoot.appendChild(section);
}

function initLenis() {
  if (window.__lenis || typeof window.Lenis !== 'function') return;
  document.documentElement.classList.add('lenis-enabled');
  const lenis = new window.Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });
  window.__lenis = lenis;
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

function markPostRead() {
  const slug = getCurrentSlug();
  if (!slug) return;
  try { localStorage.setItem(`read:${slug}`, '1'); } catch {}
}

export function enhancePost() {
  const body = document.querySelector('.post-body');
  if (!body) return;
  const tocRoot = document.getElementById('post-toc');

  markPostRead();
  initLenis();
  addLineNumbersClass(body);
  addCopyButtons(body);

  const tocResult = buildToc(body, tocRoot);
  if (tocResult && tocResult.items) {
    wireScrollSpy(tocResult.items, tocResult.bar, tocResult.indicator);
  }

  renderRelated(tocRoot);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhancePost);
} else {
  enhancePost();
}
