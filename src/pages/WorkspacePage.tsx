import { useState } from "react";
import type { Adventure, AdventureSectionKey } from "../models/adventure";
import { ProgressPanel } from "../components/ProgressPanel";
import { ContinuePanel } from "../components/ContinuePanel";
import { AuthoringPanel } from "../components/AuthoringPanel";

interface WorkspacePageProps {
  adventure: Adventure;
  onBack: () => void;
  onDelete: (id: string) => void;
  onUpdate: (adventure: Adventure) => void;
}

export function WorkspacePage({
  adventure,
  onBack,
  onDelete,
  onUpdate
}: WorkspacePageProps) {
  const [activeSection, setActiveSection] = useState<AdventureSectionKey | null>(null);

  function saveAnswers(answers: string[]) {
    if (!activeSection) return;

    onUpdate({
      ...adventure,
      updated: new Date().toISOString(),
      sections: {
        ...adventure.sections,
        [activeSection]: {
          ...adventure.sections[activeSection],
          answers,
          content: answers.filter(Boolean).join("\n\n")
        }
      }
    });
  }

  function completeSection(answers: string[]) {
    if (!activeSection) return;

    const sectionName = activeSection.charAt(0).toUpperCase() + activeSection.slice(1);
    const sections = {
      ...adventure.sections,
      [activeSection]: {
        complete: true,
        answers,
        content: answers.filter(Boolean).join("\n\n")
      }
    };

    const allComplete = Object.values(sections).every((section) => section.complete);

    onUpdate({
      ...adventure,
      updated: new Date().toISOString(),
      status: allComplete ? "complete" : "draft",
      sections,
      activity: [`${sectionName} completed`, ...adventure.activity]
    });

    setActiveSection(null);
  }

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

        {activeSection ? (
          <AuthoringPanel
            section={activeSection}
            savedAnswers={adventure.sections[activeSection].answers ?? []}
            onSaveAnswer={saveAnswers}
            onComplete={completeSection}
            onExit={() => setActiveSection(null)}
          />
        ) : (
          <ContinuePanel
            adventure={adventure}
            onContinue={setActiveSection}
          />
        )}

        <aside className="panel activity-panel">
          <h2>Recent Activity</h2>
          <ul>
            {adventure.activity.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
          </ul>
          <hr />
          <h2>Workspace Modes</h2>
          <ul>
            <li>Dashboard</li>
            <li className={activeSection ? "active-mode" : ""}>Authoring</li>
            <li>Editing — later</li>
            <li>Preview — later</li>
            <li>Publishing — later</li>
          </ul>
          <hr />
          <button className="danger-link" onClick={() => onDelete(adventure.id)}>
            Delete Adventure
          </button>
        </aside>
      </section>
    </main>
  );
}
