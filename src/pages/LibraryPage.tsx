import { useMemo, useState } from "react";
import type { Adventure, AdventureStatus } from "../models/adventure";

interface LibraryPageProps {
  adventures: Adventure[];
  onOpen: (id: string) => void;
  onCreate: () => void;
}

function formatUpdated(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  if (sameDay) return "Today";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === today.getFullYear() ? undefined : "numeric"
  }).format(date);
}

function LibraryHelp() {
  return (
    <details style={{ position: "relative", alignSelf: "flex-start" }}>
      <summary
        className="link-button"
        style={{ cursor: "pointer", listStyle: "none", whiteSpace: "nowrap" }}
      >
        <span aria-hidden="true">❓</span> What can I do here?
      </summary>

      <section
        aria-label="What you can do on this page"
        style={{
          position: "absolute",
          zIndex: 20,
          top: "calc(100% + 0.75rem)",
          right: 0,
          width: "min(24rem, calc(100vw - 2rem))",
          padding: "1rem 1.25rem",
          border: "1px solid var(--border-color, #d7dce3)",
          borderRadius: "0.75rem",
          background: "var(--panel-background, #ffffff)",
          boxShadow: "0 0.75rem 2rem rgba(0, 0, 0, 0.14)"
        }}
      >
        <h2 style={{ marginTop: 0 }}>What can I do here?</h2>
        <p>This is the starting point for your Adventures.</p>
        <ul style={{ marginBottom: 0, paddingLeft: "1.25rem" }}>
          <li>Continue the Adventure you worked on most recently.</li>
          <li>Open another Adventure.</li>
          <li>Create a new Adventure.</li>
        </ul>
      </section>
    </details>
  );
}

export function LibraryPage({ adventures, onOpen, onCreate }: LibraryPageProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AdventureStatus | "all">("all");

  const sortedAdventures = useMemo(
    () =>
      [...adventures].sort(
        (left, right) =>
          new Date(right.updated).getTime() - new Date(left.updated).getTime()
      ),
    [adventures]
  );

  const mostRecentAdventure = sortedAdventures[0];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return sortedAdventures
      .filter((adventure) => status === "all" || adventure.status === status)
      .filter((adventure) =>
        [adventure.title, adventure.summary, adventure.domain, ...adventure.tags]
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
  }, [sortedAdventures, search, status]);

  const missionCount = adventures.reduce(
    (total, adventure) => total + adventure.missions.length,
    0
  );

  const header = (
    <header
      className="library-section-heading"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "1rem"
      }}
    >
      <div>
        <p className="eyebrow">Adventure Learning Studio</p>
        <h1>{adventures.length === 0 ? "Create your first learning adventure" : "Welcome back."}</h1>
      </div>
      <LibraryHelp />
    </header>
  );

  if (adventures.length === 0) {
    return (
      <main className="page-shell studio-home">
        {header}
        <section className="empty-library-state">
          <p>
            Begin with one real-world skill. You can add missions, comic panels,
            practice activities, and confidence checks as the Adventure grows.
          </p>
          <button className="primary-button" onClick={onCreate}>
            + Create First Adventure
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell studio-home">
      {header}

      {mostRecentAdventure && (
        <section className="library-section-heading" aria-labelledby="continue-heading">
          <div>
            <p className="eyebrow">Here is where you left off</p>
            <h2 id="continue-heading">{mostRecentAdventure.title}</h2>
            <p>
              Updated {formatUpdated(mostRecentAdventure.updated)} · {mostRecentAdventure.missions.length}{" "}
              {mostRecentAdventure.missions.length === 1 ? "mission" : "missions"} · Status: {mostRecentAdventure.status}
            </p>

            <div className="studio-hero-actions">
              <button
                className="primary-button studio-primary-action"
                onClick={() => onOpen(mostRecentAdventure.id)}
              >
                Continue <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="library-section-heading">
        <div>
          <p className="eyebrow">Choose what you would like to do</p>
          <h2>Other things you can do</h2>
          <p>Open another Adventure or begin a new one.</p>

          <div className="studio-hero-actions">
            <button className="primary-button" onClick={onCreate}>
              + New Adventure
            </button>
            <span>
              {adventures.length} {adventures.length === 1 ? "adventure" : "adventures"}
              {missionCount > 0 ? ` · ${missionCount} missions` : ""}
            </span>
          </div>
        </div>
      </section>

      <section className="library-section-heading">
        <div>
          <p className="eyebrow">Your work</p>
          <h2>Your Adventures</h2>
          <p>Choose any Adventure to open it.</p>
        </div>
      </section>

      {adventures.length > 1 && (
        <section className="library-toolbar" aria-label="Adventure filters">
          <input
            type="search"
            placeholder="Search adventures"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as AdventureStatus | "all")}
          >
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="complete">Complete</option>
            <option value="published">Published</option>
          </select>
        </section>
      )}

      {filtered.length > 0 ? (
        <section className="library-grid">
          {filtered.map((adventure) => (
            <article className="library-card studio-adventure-card" key={adventure.id}>
              <div className="adventure-card-topline">
                <span className={`status-badge ${adventure.status}`}>{adventure.status}</span>
                <span className="updated-label">Updated {formatUpdated(adventure.updated)}</span>
              </div>

              <div className="adventure-card-copy">
                <p className="eyebrow">{adventure.domain}</p>
                <h2>{adventure.title}</h2>
                <p>{adventure.summary}</p>
              </div>

              <div className="adventure-card-stats">
                <div>
                  <strong>{adventure.missions.length}</strong>
                  <span>{adventure.missions.length === 1 ? "Mission" : "Missions"}</span>
                </div>
                <div>
                  <strong>{adventure.version}</strong>
                  <span>Version</span>
                </div>
              </div>

              {adventure.tags.length > 0 && (
                <div className="tag-row">
                  {adventure.tags.slice(0, 4).map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>
              )}

              <button
                className="primary-button open-adventure-button"
                onClick={() => onOpen(adventure.id)}
              >
                Open Adventure <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-library-state">
          <h2>No Adventures match your search</h2>
          <p>Try a different search term or status.</p>
        </section>
      )}
    </main>
  );
}
