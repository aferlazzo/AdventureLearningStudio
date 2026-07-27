import type { Adventure, Mission, MissionElement } from "../models/adventure";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeImageSource(value: string): string {
  const trimmed = value.trim();
  if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(trimmed)) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return escapeHtml(trimmed);
  return "";
}

function renderText(value: string): string {
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "adventure";
}

function elementClassName(element: MissionElement): string {
  return element.type.toLowerCase().replace(/\s+/g, "-");
}

function renderComicPanel(element: MissionElement): string {
  const source = safeImageSource(element.imageDataUrl || element.imageUrl || "");
  const image = source
    ? `<img src="${source}" alt="${escapeHtml(element.altText || "Comic panel")}">`
    : `<div class="comic-placeholder">Comic artwork</div>`;
  const dialogue = element.dialogue
    ? `<div class="speech-bubble">${escapeHtml(element.dialogue)}</div>`
    : "";
  const thought = element.thought
    ? `<div class="thought-bubble">${escapeHtml(element.thought)}</div>`
    : "";
  const title = element.title ? `<h3>${escapeHtml(element.title)}</h3>` : "";
  const caption = element.caption ? renderText(element.caption) : "";
  const teachingNote = element.teachingNote
    ? `<aside class="learning-moment"><strong>Learning moment</strong>${renderText(element.teachingNote)}</aside>`
    : "";

  return `
    <figure class="comic-panel-card">
      <div class="comic-artwork">
        ${image}
        ${dialogue}
        ${thought}
      </div>
      <figcaption>
        ${title}
        ${caption}
      </figcaption>
      ${teachingNote}
    </figure>
  `;
}

function renderElement(element: MissionElement): string {
  if (element.type === "Comic Panel") return renderComicPanel(element);

  const title = element.title ? `<h3>${escapeHtml(element.title)}</h3>` : "";
  const body = element.body
    ? renderText(element.body)
    : '<p class="empty">No content has been added yet.</p>';

  return `
    <section class="mission-element ${elementClassName(element)}">
      <p class="element-type">${escapeHtml(element.type)}</p>
      ${title}
      ${body}
    </section>
  `;
}

function renderMission(mission: Mission): string {
  const elements = mission.elements.length
    ? mission.elements.map(renderElement).join("\n")
    : '<p class="empty">This mission does not contain any elements yet.</p>';

  return `
    <article id="mission-${mission.number}" class="mission">
      <header class="mission-header">
        <p class="mission-number">Mission ${mission.number}</p>
        <h2>${escapeHtml(mission.title)}</h2>
      </header>
      ${mission.goal ? `<section class="mission-goal"><h3>Goal</h3>${renderText(mission.goal)}</section>` : ""}
      <div class="mission-elements">${elements}</div>
      ${mission.realWorldAction ? `<section class="real-world-action"><h3>Real-World Action</h3>${renderText(mission.realWorldAction)}</section>` : ""}
      ${mission.confidenceQuestion ? `<section class="confidence-check"><h3>Confidence Check</h3>${renderText(mission.confidenceQuestion)}</section>` : ""}
    </article>
  `;
}

export function buildAdventureHtml(adventure: Adventure): string {
  const missions = adventure.missions.length
    ? adventure.missions.map(renderMission).join("\n")
    : '<p class="empty">This Adventure does not contain any missions yet.</p>';
  const navigation = adventure.missions
    .map((mission) => `<a href="#mission-${mission.number}">Mission ${mission.number}</a>`)
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
    .adventure-header { background: #fff; border-bottom: 1px solid #d7d9dc; padding: 3rem 1.25rem 2rem; }
    .adventure-header-inner, nav, main { width: min(900px, 100%); margin: 0 auto; }
    .eyebrow, .mission-number, .element-type { margin: 0 0 .5rem; font-size: .8rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #59636e; }
    h1 { margin: 0; font-size: clamp(2rem, 6vw, 3.5rem); line-height: 1.1; }
    h2, h3 { line-height: 1.25; }
    .summary { max-width: 720px; font-size: 1.15rem; color: #4b5563; }
    .meta, .tags { color: #6b7280; font-size: .9rem; }
    nav { display: flex; flex-wrap: wrap; gap: .6rem; padding: 1rem 1.25rem; }
    nav a { color: #1f4f7a; text-decoration: none; background: #eaf1f7; border-radius: 999px; padding: .4rem .75rem; font-weight: 650; }
    main { padding: 1rem 1.25rem 4rem; }
    .overview-section, .mission { background: #fff; border: 1px solid #d7d9dc; border-radius: 14px; padding: 1.5rem; margin: 1rem 0; box-shadow: 0 8px 24px rgba(31,41,55,.05); }
    .mission { margin-top: 2rem; }
    .mission-header { border-bottom: 1px solid #eceef0; margin-bottom: 1.25rem; }
    .mission-header h2 { margin-top: 0; }
    .mission-goal { padding: 1rem; margin-bottom: 1.25rem; border-radius: 10px; background: #f3f4f6; }
    .mission-element { padding: 1.1rem; margin: 1rem 0; border: 1px solid #d7d9dc; border-radius: 10px; background: #fff; }
    .mission-element h3 { margin-top: 0; }
    .warning { border-left: 6px solid #b91c1c; background: #fff7f7; }
    .tip { border-left: 6px solid #2f855a; background: #f4fff8; }
    .question { border-left: 6px solid #5b5fc7; background: #f7f7ff; }
    .instruction { border-left: 6px solid #1f4f7a; }
    .comic-panel-card { margin: 1.5rem 0; border: 2px solid #1f2937; border-radius: 12px; overflow: hidden; background: #fff; break-inside: avoid; }
    .comic-artwork { position: relative; min-height: 240px; background: #eef1f4; overflow: hidden; }
    .comic-artwork img { display: block; width: 100%; max-height: 680px; object-fit: contain; background: #eef1f4; }
    .comic-placeholder { min-height: 300px; display: grid; place-items: center; color: #6b7280; font-weight: 700; }
    .speech-bubble, .thought-bubble { position: absolute; max-width: 46%; padding: .7rem .9rem; background: #fff; border: 2px solid #1f2937; color: #111827; font-weight: 650; line-height: 1.3; box-shadow: 0 3px 8px rgba(0,0,0,.12); }
    .speech-bubble { left: 1rem; top: 1rem; border-radius: 18px; }
    .thought-bubble { right: 1rem; top: 1rem; border-radius: 50%; padding: 1rem 1.2rem; font-style: italic; }
    .comic-panel-card figcaption { padding: 1rem 1.15rem; border-top: 1px solid #d7d9dc; }
    .comic-panel-card figcaption h3 { margin: 0 0 .4rem; }
    .learning-moment { margin: 0 1rem 1rem; padding: .9rem 1rem; border-left: 5px solid #a16207; background: #fffbeb; }
    .learning-moment p:last-child { margin-bottom: 0; }
    .real-world-action, .confidence-check { padding: 1.1rem; margin-top: 1.25rem; border-radius: 10px; }
    .real-world-action { border: 2px solid #4c9b8f; }
    .confidence-check { border: 2px solid #7474c9; background: #f4f4ff; }
    .empty { color: #777; font-style: italic; }
    footer { text-align: center; color: #6b7280; padding: 0 1rem 3rem; font-size: .85rem; }
    @media (max-width: 600px) { .speech-bubble, .thought-bubble { position: static; display: block; max-width: none; margin: .75rem; } }
    @media print { nav { display: none; } body { background: #fff; } .overview-section, .mission { box-shadow: none; } .mission-element, .mission-goal, .real-world-action, .confidence-check, .comic-panel-card { break-inside: avoid; } }
  </style>
</head>
<body>
  <header class="adventure-header">
    <div class="adventure-header-inner">
      <p class="eyebrow">${escapeHtml(adventure.domain)}</p>
      <h1>${escapeHtml(adventure.title)}</h1>
      <p class="summary">${escapeHtml(adventure.summary)}</p>
      <p class="meta">By ${escapeHtml(adventure.author)} · Version ${adventure.version}</p>
      ${tags}
    </div>
  </header>
  ${navigation ? `<nav aria-label="Adventure missions">${navigation}</nav>` : ""}
  <main>
    ${adventure.purpose ? `<section class="overview-section"><h2>Purpose</h2>${renderText(adventure.purpose)}</section>` : ""}
    ${adventure.audience ? `<section class="overview-section"><h2>Audience</h2>${renderText(adventure.audience)}</section>` : ""}
    ${adventure.confidenceOutcome ? `<section class="overview-section"><h2>Confidence Outcome</h2>${renderText(adventure.confidenceOutcome)}</section>` : ""}
    ${missions}
  </main>
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
