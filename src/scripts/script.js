// Homepage: fetch posts.json and render the post list.

async function loadPosts() {
  const list = document.querySelector('.posts-list');
  if (!list) return;

  let data;
  try {
    const res = await fetch('./posts.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    list.innerHTML = `
      <div class="card card-admonition card-warning">
        <div class="card-admonition-header">
          <i class="ph ph-warning"></i>
          <span class="card-admonition-title">Could not load posts</span>
        </div>
        <div class="card-admonition-body"><p>${err.message}</p></div>
      </div>
    `;
    return;
  }

  const posts = (data.posts || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));

  if (posts.length === 0) {
    list.innerHTML = `
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

  list.innerHTML = posts.map((p) => `
    <a class="post-card" href="posts/${p.slug}.html">
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

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadPosts);
} else {
  loadPosts();
}
