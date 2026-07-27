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

export function LibraryPage({ adventures, onOpen, onCreate }: LibraryPageProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AdventureStatus | "all">("all");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return adventures
      .filter((adventure) => status === "all" || adventure.status === status)
      .filter((adventure) =>
        [adventure.title, adventure.summary, adventure.domain, ...adventure.tags]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
      .sort(
        (left, right) =>
          new Date(right.updated).getTime() - new Date(left.updated).getTime()
      );
  }, [adventures, search, status]);

  const missionCount = adventures.reduce(
    (total, adventure) => total + adventure.missions.length,
    0
  );

  return (
    <main className="page-shell studio-home">
      <section className="studio-hero">
        <div className="studio-hero-copy">
          <p className="eyebrow">Adventure Learning Studio</p>
          <h1>Create comic-infused learning adventures.</h1>
          <p className="studio-lead">
            Turn real-world skills into short missions that combine story,
            teaching, practice, and confidence.
          </p>

          <div className="studio-hero-actions">
            <button className="primary-button studio-primary-action" onClick={onCreate}>
              + New Adventure
            </button>
            <span>
              {adventures.length} {adventures.length === 1 ? "adventure" : "adventures"}
              {missionCount > 0 ? ` · ${missionCount} missions` : ""}
            </span>
          </div>
        </div>

        <aside className="studio-method-card" aria-label="Adventure Learning method">
          <p className="eyebrow">The learning pattern</p>
          <ol>
            <li><strong>Story</strong><span>Make the situation relatable.</span></li>
            <li><strong>Learn</strong><span>Explain what matters at the right moment.</span></li>
            <li><strong>Practice</strong><span>Ask the learner to try it.</span></li>
            <li><strong>Confidence</strong><span>Finish with “I can do this.”</span></li>
          </ol>
        </aside>
      </section>

      <section className="library-section-heading">
        <div>
          <p className="eyebrow">Your work</p>
          <h2>Continue building</h2>
          <p>Open an adventure and pick up where you left off.</p>
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
            onChange={(event) =>
              setStatus(event.target.value as AdventureStatus | "all")
            }
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
                <span className={`status-badge ${adventure.status}`}>
                  {adventure.status}
                </span>
                <span className="updated-label">
                  Updated {formatUpdated(adventure.updated)}
                </span>
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
      ) : adventures.length === 0 ? (
        <section className="empty-library-state">
          <p className="eyebrow">Start here</p>
          <h2>Create your first learning adventure</h2>
          <p>
            Begin with one real-world skill. You can add missions, comic panels,
            practice activities, and confidence checks as the adventure grows.
          </p>
          <button className="primary-button" onClick={onCreate}>
            + Create First Adventure
          </button>
        </section>
      ) : (
        <section className="empty-library-state">
          <h2>No adventures match your search</h2>
          <p>Try a different search term or status.</p>
        </section>
      )}
    </main>
  );
}
