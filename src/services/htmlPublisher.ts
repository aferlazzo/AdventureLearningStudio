import type {
  Adventure,
  Mission,
  MissionElement,
} from "../models/adventure";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderText(value: string): string {
  const paragraphs = value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return "";
  }

  return paragraphs
    .map(
      (paragraph) =>
        `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`
    )
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

function elementClassName(element: MissionElement): string {
  return element.type
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function renderElement(element: MissionElement): string {
  const title = element.title
    ? `<h3>${escapeHtml(element.title)}</h3>`
    : "";

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
  const elements =
    mission.elements.length > 0
      ? mission.elements.map(renderElement).join("\n")
      : '<p class="empty">This mission does not contain any elements yet.</p>';

  const goal = mission.goal
    ? `
      <section class="mission-goal">
        <h3>Goal</h3>
        ${renderText(mission.goal)}
      </section>
    `
    : "";

  const realWorldAction = mission.realWorldAction
    ? `
      <section class="real-world-action">
        <h3>Real-World Action</h3>
        ${renderText(mission.realWorldAction)}
      </section>
    `
    : "";

  const confidenceQuestion = mission.confidenceQuestion
    ? `
      <section class="confidence-check">
        <h3>Confidence Check</h3>
        ${renderText(mission.confidenceQuestion)}
      </section>
    `
    : "";

  return `
    <article id="mission-${mission.number}" class="mission">
      <header class="mission-header">
        <p class="mission-number">Mission ${mission.number}</p>
        <h2>${escapeHtml(mission.title)}</h2>
      </header>

      ${goal}

      <div class="mission-elements">
        ${elements}
      </div>

      ${realWorldAction}
      ${confidenceQuestion}
    </article>
  `;
}

export function buildAdventureHtml(adventure: Adventure): string {
  const missions =
    adventure.missions.length > 0
      ? adventure.missions.map(renderMission).join("\n")
      : '<p class="empty">This Adventure does not contain any missions yet.</p>';

  const navigation =
    adventure.missions.length > 0
      ? adventure.missions
          .map(
            (mission) =>
              `<a href="#mission-${mission.number}">Mission ${mission.number}</a>`
          )
          .join("\n")
      : "";

  const tags =
    adventure.tags.length > 0
      ? `<p class="tags">${adventure.tags
          .map(escapeHtml)
          .join(" · ")}</p>`
      : "";

  const purpose = adventure.purpose
    ? `
      <section class="overview-section">
        <h2>Purpose</h2>
        ${renderText(adventure.purpose)}
      </section>
    `
    : "";

  const audience = adventure.audience
    ? `
      <section class="overview-section">
        <h2>Audience</h2>
        ${renderText(adventure.audience)}
      </section>
    `
    : "";

  const confidenceOutcome = adventure.confidenceOutcome
    ? `
      <section class="overview-section">
        <h2>Confidence Outcome</h2>
        ${renderText(adventure.confidenceOutcome)}
      </section>
    `
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(adventure.title)}</title>

  <style>
    :root {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #1f2937;
      background: #f7f7f5;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      line-height: 1.6;
    }

    header.adventure-header {
      background: #ffffff;
      border-bottom: 1px solid #d7d9dc;
      padding: 3rem 1.25rem 2rem;
    }

    .adventure-header-inner,
    nav,
    main {
      width: min(900px, 100%);
      margin: 0 auto;
    }

    .eyebrow,
    .mission-number,
    .element-type {
      margin: 0 0 .5rem;
      font-size: .8rem;
      font-weight: 700;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: #59636e;
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 6vw, 3.5rem);
      line-height: 1.1;
    }

    h2,
    h3 {
      line-height: 1.25;
    }

    .summary {
      max-width: 720px;
      font-size: 1.15rem;
      color: #4b5563;
    }

    .meta,
    .tags {
      color: #6b7280;
      font-size: .9rem;
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      gap: .6rem;
      padding: 1rem 1.25rem;
    }

    nav a {
      color: #1f4f7a;
      text-decoration: none;
      background: #eaf1f7;
      border-radius: 999px;
      padding: .4rem .75rem;
      font-weight: 650;
    }

    main {
      padding: 1rem 1.25rem 4rem;
    }

    .overview-section,
    .mission {
      background: #ffffff;
      border: 1px solid #d7d9dc;
      border-radius: 14px;
      padding: 1.5rem;
      margin: 1rem 0;
      box-shadow: 0 8px 24px rgba(31, 41, 55, .05);
    }

    .mission {
      margin-top: 2rem;
    }

    .mission-header {
      border-bottom: 1px solid #eceef0;
      margin-bottom: 1.25rem;
    }

    .mission-header h2 {
      margin-top: 0;
    }

    .mission-goal {
      padding: 1rem;
      margin-bottom: 1.25rem;
      border-radius: 10px;
      background: #f3f4f6;
    }

    .mission-element {
      padding: 1.1rem;
      margin: 1rem 0;
      border: 1px solid #d7d9dc;
      border-radius: 10px;
      background: #ffffff;
    }

    .mission-element h3 {
      margin-top: 0;
    }

    .warning {
      border-left: 6px solid #b91c1c;
      background: #fff7f7;
    }

    .tip {
      border-left: 6px solid #2f855a;
      background: #f4fff8;
    }

    .question {
      border-left: 6px solid #5b5fc7;
      background: #f7f7ff;
    }

    .instruction {
      border-left: 6px solid #1f4f7a;
    }

    .comic-panel {
      border-left: 6px solid #a16207;
      background: #fffbeb;
    }

    .real-world-action,
    .confidence-check {
      padding: 1.1rem;
      margin-top: 1.25rem;
      border-radius: 10px;
    }

    .real-world-action {
      border: 2px solid #4c9b8f;
    }

    .confidence-check {
      border: 2px solid #7474c9;
      background: #f4f4ff;
    }

    .empty {
      color: #777;
      font-style: italic;
    }

    footer {
      text-align: center;
      color: #6b7280;
      padding: 0 1rem 3rem;
      font-size: .85rem;
    }

    @media print {
      nav {
        display: none;
      }

      body {
        background: #ffffff;
      }

      .overview-section,
      .mission {
        box-shadow: none;
      }

      .mission-element,
      .mission-goal,
      .real-world-action,
      .confidence-check {
        break-inside: avoid;
      }
    }
  </style>
</head>

<body>
  <header class="adventure-header">
    <div class="adventure-header-inner">
      <p class="eyebrow">${escapeHtml(adventure.domain)}</p>
      <h1>${escapeHtml(adventure.title)}</h1>
      <p class="summary">${escapeHtml(adventure.summary)}</p>
      <p class="meta">
        By ${escapeHtml(adventure.author)} · Version ${adventure.version}
      </p>
      ${tags}
    </div>
  </header>

  ${navigation ? `<nav aria-label="Adventure missions">${navigation}</nav>` : ""}

  <main>
    ${purpose}
    ${audience}
    ${confidenceOutcome}
    ${missions}
  </main>

  <footer>Published with Adventure Learning Studio</footer>
</body>
</html>`;
}

export function publishAdventureHtml(adventure: Adventure): void {
  const html = buildAdventureHtml(adventure);
  const blob = new Blob([html], {
    type: "text/html;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${slugify(adventure.title)}.html`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}