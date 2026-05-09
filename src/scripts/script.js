// Homepage: fetch posts.json, render Start-here hero + main post list + about.
// Auto-hides Start-here once the reader has visited every post in it (localStorage).

const READ_KEY = (slug) => `read:${slug}`;
const DISMISS_KEY = 'startHereDismissed';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function importanceClass(p) {
  return ['must-know', 'level-up', 'optional'].includes(p.importance) ? p.importance : 'optional';
}

function importanceLabel(p) {
  return ({ 'must-know': 'Must-know', 'level-up': 'Level-up', 'optional': 'Optional' })[importanceClass(p)];
}

function pickStartHere(posts) {
  const musts = posts.filter((p) => p.importance === 'must-know').slice(0, 3);
  if (musts.length === 3) return musts;
  // Pad with most-recent non-must-know if we don't have 3 must-knows yet.
  const filler = posts.filter((p) => !musts.includes(p)).slice(0, 3 - musts.length);
  return [...musts, ...filler];
}

function isPostRead(slug) {
  try { return !!localStorage.getItem(READ_KEY(slug)); } catch { return false; }
}

function startHereDismissed() {
  try { return !!localStorage.getItem(DISMISS_KEY); } catch { return false; }
}

function renderStartHere(picks) {
  const list = document.getElementById('start-here-list');
  list.innerHTML = picks.map((p, i) => `
    <a class="start-here-step ${importanceClass(p)}${isPostRead(p.slug) ? ' is-read' : ''}" href="posts/${escapeHtml(p.slug)}.html">
      <span class="start-here-num">${i + 1}</span>
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(p.description)}</p>
      <div class="start-here-meta">
        <span><i class="ph ph-clock"></i> ${escapeHtml(String(p.readingTime))} min</span>
        ${isPostRead(p.slug) ? '<span class="read-tick"><i class="ph ph-check-circle-fill"></i> read</span>' : ''}
      </div>
    </a>
  `).join('');
}

function renderPostList(posts) {
  const list = document.querySelector('.posts-list');
  list.innerHTML = posts.map((p) => `
    <a class="post-card ${importanceClass(p)}" href="posts/${escapeHtml(p.slug)}.html">
      <span class="post-card-tier">${importanceLabel(p)}</span>
      <div class="post-card-meta">
        <span><i class="ph ph-calendar-blank"></i> ${escapeHtml(p.date)}</span>
        <span><i class="ph ph-clock"></i> ${escapeHtml(String(p.readingTime))} min</span>
      </div>
      <h2 class="post-card-title">${escapeHtml(p.title)}</h2>
      <p class="post-card-desc">${escapeHtml(p.description)}</p>
      <div class="post-card-cta">
        <span>Read post</span>
        <i class="ph ph-arrow-right"></i>
      </div>
    </a>
  `).join('');
}

function renderError(message) {
  document.querySelector('.posts-list').innerHTML = `
    <div class="card card-admonition card-warning">
      <div class="card-admonition-header">
        <i class="ph ph-warning"></i>
        <span class="card-admonition-title">Could not load posts</span>
      </div>
      <div class="card-admonition-body"><p>${escapeHtml(message)}</p></div>
    </div>
  `;
}

async function loadPosts() {
  let data;
  try {
    const res = await fetch('./posts.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    renderError(err.message);
    return;
  }

  const posts = (data.posts || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));

  if (posts.length === 0) {
    document.querySelector('.posts-list').innerHTML = `
      <div class="card card-admonition card-info">
        <div class="card-admonition-header">
          <i class="ph ph-info"></i>
          <span class="card-admonition-title">No posts yet</span>
        </div>
        <div class="card-admonition-body"><p>Check back soon.</p></div>
      </div>
    `;
    return;
  }

  const startHere = pickStartHere(posts);
  const allRead = startHere.every((p) => isPostRead(p.slug));
  const showStartHere = !startHereDismissed() && !allRead && startHere.length > 0;

  const startHereSection = document.getElementById('start-here');
  if (showStartHere) {
    renderStartHere(startHere);
    startHereSection.hidden = false;
    const restSlugs = new Set(startHere.map((p) => p.slug));
    renderPostList(posts.filter((p) => !restSlugs.has(p.slug)));
  } else {
    renderPostList(posts);
  }

  const dismissBtn = document.getElementById('start-here-dismiss');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      try { localStorage.setItem(DISMISS_KEY, '1'); } catch {}
      startHereSection.hidden = true;
      renderPostList(posts);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadPosts);
} else {
  loadPosts();
}
