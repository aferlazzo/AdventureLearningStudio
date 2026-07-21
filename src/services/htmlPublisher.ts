import type { Adventure, AdventureSectionKey } from "../models/adventure";

const sectionOrder: AdventureSectionKey[] = [
  "situation",
  "anxiety",
  "decision",
  "experience",
  "consequences",
  "capability",
];

const sectionLabels: Record<AdventureSectionKey, string> = {
  situation: "Situation",
  anxiety: "Anxiety",
  decision: "Decision",
  experience: "Experience",
  consequences: "Consequences",
  capability: "Capability",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderParagraphs(content: string): string {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return '<p class="empty">This section has not been completed yet.</p>';
  }

  return paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "adventure";
}

export function buildAdventureHtml(adventure: Adventure): string {
  const sections = sectionOrder
    .map((key) => {
      const section = adventure.sections[key];
      return `
        <section id="${key}" class="adventure-section">
          <div class="section-heading">
            <h2>${sectionLabels[key]}</h2>
            <span class="section-status">${section.complete ? "Complete" : "In progress"}</span>
          </div>
          ${renderParagraphs(section.content)}
        </section>`;
    })
    .join("\n");

  const navigation = sectionOrder
    .map((key) => `<a href="#${key}">${sectionLabels[key]}</a>`)
    .join("\n");

  const tags = adventure.tags.length
    ? `<p class="tags">${adventure.tags.map(escapeHtml).join(" · ")}</p>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(adventure.title)}</title>
  <style>
    :root { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #1f2937; background: #f7f7f5; }
    * { box-sizing: border-box; }
    body { margin: 0; line-height: 1.6; }
    header { background: #ffffff; border-bottom: 1px solid #d7d9dc; padding: 3rem 1.25rem 2rem; }
    header div, main, nav { width: min(860px, 100%); margin: 0 auto; }
    .eyebrow { margin: 0 0 .5rem; font-size: .8rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #59636e; }
    h1 { margin: 0; font-size: clamp(2rem, 6vw, 3.5rem); line-height: 1.1; }
    .summary { max-width: 700px; font-size: 1.15rem; color: #4b5563; }
    .meta, .tags { color: #6b7280; font-size: .9rem; }
    nav { display: flex; flex-wrap: wrap; gap: .6rem; padding: 1rem 1.25rem; }
    nav a { color: #1f4f7a; text-decoration: none; background: #eaf1f7; border-radius: 999px; padding: .4rem .75rem; font-weight: 650; }
    main { padding: 1rem 1.25rem 4rem; }
    .adventure-section { background: #ffffff; border: 1px solid #d7d9dc; border-radius: 14px; padding: 1.5rem; margin: 1rem 0; box-shadow: 0 8px 24px rgba(31, 41, 55, .05); }
    .section-heading { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; border-bottom: 1px solid #eceef0; margin-bottom: 1rem; }
    h2 { margin: 0 0 .75rem; }
    .section-status { color: #6b7280; font-size: .85rem; white-space: nowrap; }
    .empty { color: #777; font-style: italic; }
    footer { text-align: center; color: #6b7280; padding: 0 1rem 3rem; font-size: .85rem; }
    @media print { nav { display: none; } body { background: #fff; } .adventure-section { box-shadow: none; break-inside: avoid; } }
  </style>
</head>
<body>
  <header>
    <div>
      <p class="eyebrow">${escapeHtml(adventure.domain)}</p>
      <h1>${escapeHtml(adventure.title)}</h1>
      <p class="summary">${escapeHtml(adventure.summary)}</p>
      <p class="meta">By ${escapeHtml(adventure.author)} · Version ${adventure.version}</p>
      ${tags}
    </div>
  </header>
  <nav aria-label="Adventure sections">${navigation}</nav>
  <main>${sections}</main>
  <footer>Published with Adventure Learning Studio</footer>
</body>
</html>`;
}

export function publishAdventureHtml(adventure: Adventure): void {
  const html = buildAdventureHtml(adventure);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${slugify(adventure.title)}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
