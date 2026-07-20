import { useMemo, useState } from "react";
import type { Adventure, AdventureStatus } from "../models/adventure";

interface LibraryPageProps {
  adventures: Adventure[];
  onOpen: (id: string) => void;
  onCreate: () => void;
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
      );
  }, [adventures, search, status]);

  return (
    <main className="page-shell">
      <section className="library-hero">
        <div>
          <p className="eyebrow">Adventure Library</p>
          <h1>Your Adventures</h1>
          <p>Find an Adventure, open its Workspace, and continue building.</p>
        </div>
        <button className="primary-button" onClick={onCreate}>New Adventure</button>
      </section>

      <section className="library-toolbar">
        <input
          type="search"
          placeholder="Search adventures"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={status} onChange={(event) => setStatus(event.target.value as AdventureStatus | "all")}>
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="complete">Complete</option>
          <option value="published">Published</option>
        </select>
      </section>

      <section className="library-grid">
        {filtered.map((adventure) => (
          <article className="library-card" key={adventure.id}>
            <span className={`status-badge ${adventure.status}`}>{adventure.status}</span>
            <h2>{adventure.title}</h2>
            <p>{adventure.summary}</p>
            <div className="tag-row">
              <span className="tag">{adventure.domain}</span>
              {adventure.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
            </div>
            <button className="primary-button" onClick={() => onOpen(adventure.id)}>Open Workspace</button>
          </article>
        ))}
      </section>
    </main>
  );
}
