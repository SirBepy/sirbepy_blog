// Shared transforms for rendered Markdown HTML.
// Browser+Node compatible. ES module syntax works in both modern browsers and Node.

const ADMONITION_LABELS = {
  tip: { icon: 'ph-lightbulb', label: 'Tip' },
  note: { icon: 'ph-note-pencil', label: 'Note' },
  warning: { icon: 'ph-warning', label: 'Warning' },
  important: { icon: 'ph-star', label: 'Important' },
  caution: { icon: 'ph-shield-warning', label: 'Caution' },
  info: { icon: 'ph-info', label: 'Info' },
};

// GFM admonitions: > [!tip] Optional title \n > body...
// Marked renders these as a blockquote whose first paragraph begins with [!type] [optional same-line title],
// followed by the body inside the same <p> (newline-separated) and/or in subsequent siblings.
// Transform that into <div class="card card-{type}"> with an icon header.
export function transformAdmonitions(html) {
  return html.replace(
    /<blockquote>\s*<p>\[!(\w+)\]([^\n]*?)(?:\n([\s\S]*?))?<\/p>([\s\S]*?)<\/blockquote>/gi,
    (_match, rawType, rawTitle, firstParaBody, rest) => {
      const type = rawType.toLowerCase();
      const meta = ADMONITION_LABELS[type] || { icon: 'ph-quotes', label: type };
      const title = (rawTitle || '').trim() || meta.label;
      const inlineBody = (firstParaBody || '').trim();
      const tailBody = (rest || '').trim();
      const bodyParts = [];
      if (inlineBody) bodyParts.push(`<p>${inlineBody}</p>`);
      if (tailBody) bodyParts.push(tailBody);
      return `<div class="card card-admonition card-${type}">
  <div class="card-admonition-header">
    <i class="ph ${meta.icon}"></i>
    <span class="card-admonition-title">${title}</span>
  </div>
  <div class="card-admonition-body">${bodyParts.join('\n')}</div>
</div>`;
    }
  );
}

// Wrap any `<h2>TL;DR</h2>` heading + its content (until next h2 or end) in a
// `<section class="tldr">` block. Convention-based: matches `/^TL;?\s*DR/i`.
// Also injects a phosphor lightning icon inside the heading.
export function wrapTldrSection(html) {
  return html.replace(
    /(<h2(?:\s+[^>]*)?>\s*)(TL;?\s*DR[^<]*?)(\s*<\/h2>)([\s\S]*?)(?=<h2|$)/i,
    (_match, openTag, headingText, closeTag, body) => {
      const heading = `${openTag}<i class="ph ph-lightning"></i><span>${headingText.trim()}</span>${closeTag}`;
      return `<section class="tldr">${heading}${body}</section>`;
    }
  );
}

// Compute reading time from a raw markdown body.
// 200 words/min, min 1.
export function readingTimeFromMarkdown(markdown) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/[#>*_\-\[\]\(\)!]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  return Math.max(1, Math.round(words.length / 200));
}
