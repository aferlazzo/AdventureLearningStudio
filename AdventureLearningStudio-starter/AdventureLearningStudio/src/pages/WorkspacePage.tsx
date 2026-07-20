import type { Adventure } from "../models/adventure";
import { ProgressPanel } from "../components/ProgressPanel";
import { ActionCard } from "../components/ActionCard";

interface WorkspacePageProps {
  adventure: Adventure;
  onBack: () => void;
  onDelete: (id: string) => void;
}

export function WorkspacePage({ adventure, onBack, onDelete }: WorkspacePageProps) {
  const publishLocked = adventure.status === "draft";

  return (
    <main className="page-shell">
      <section className="workspace-header">
        <div>
          <button className="link-button" onClick={onBack}>← Adventure Library</button>
          <p className="eyebrow">Adventure Workspace</p>
          <h1>{adventure.title}</h1>
          <p>{adventure.summary}</p>
        </div>
        <div className="workspace-meta">
          <span className={`status-badge ${adventure.status}`}>{adventure.status}</span>
          <span>Version {adventure.version}</span>
        </div>
      </section>

      <section className="workspace-grid">
        <ProgressPanel adventure={adventure} />

        <section className="panel workspace-actions">
          <h2>What would you like to do?</h2>
          <ActionCard
            title="Continue Authoring"
            description="Resume the Conversation Engine at the next unfinished section."
            buttonLabel="Resume"
            disabled
          />
          <ActionCard
            title="Adventure Editor"
            description="Edit completed sections directly."
            buttonLabel="Open Editor"
            disabled
          />
          <ActionCard
            title="Preview"
            description="Read the Adventure as a learner will experience it."
            buttonLabel="Preview"
            disabled
          />
          <ActionCard
            title="Publishing Center"
            description="Generate Missions, Storyboards, Websites, and PDFs."
            buttonLabel={publishLocked ? "Locked until complete" : "Open Publishing"}
            disabled
          />
          <ActionCard
            title="Learning Insights"
            description="Review gaps, duplicated concepts, and recommended follow-up Adventures."
            buttonLabel="Coming Soon"
            disabled
          />
          <ActionCard
            title="Delete Adventure"
            description="Permanently remove this Adventure from this browser."
            buttonLabel="Delete"
            danger
            onClick={() => onDelete(adventure.id)}
          />
        </section>

        <aside className="panel activity-panel">
          <h2>Recent Activity</h2>
          <ul>
            {adventure.activity.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <hr />
          <h2>Coming Later</h2>
          <ul>
            <li>Version History</li>
            <li>Notes</li>
            <li>Bookmarks</li>
            <li>AI Mentor</li>
            <li>Collaboration</li>
          </ul>
        </aside>
      </section>
    </main>
  );
}
