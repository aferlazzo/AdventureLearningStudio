import { useState } from "react";
import type { Adventure, Mission } from "../models/adventure";
import { publishAdventureHtml } from "../services/htmlPublisher";

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
  const [activeMissionId, setActiveMissionId] = useState<string | null>(
    adventure.missions[0]?.id ?? null
  );

  const activeMission =
    adventure.missions.find((mission) => mission.id === activeMissionId) ??
    adventure.missions[0];

  function updateMission(updatedMission: Mission) {
    onUpdate({
      ...adventure,
      updated: new Date().toISOString(),
      missions: adventure.missions.map((mission) =>
        mission.id === updatedMission.id ? updatedMission : mission
      )
    });
  }

  function addMission() {
    const nextNumber =
      adventure.missions.length === 0
        ? 0
        : Math.max(...adventure.missions.map((mission) => mission.number)) + 1;

    const mission: Mission = {
      id: crypto.randomUUID(),
      number: nextNumber,
      title: "Untitled Skill",
      goal: "",
      realWorldAction: "",
      confidenceQuestion: "",
      elements: []
    };

    onUpdate({
      ...adventure,
      updated: new Date().toISOString(),
      missions: [...adventure.missions, mission],
      activity: [`Skill ${nextNumber} created`, ...adventure.activity]
    });

    setActiveMissionId(mission.id);
  }

  function deleteMission(id: string) {
    const mission = adventure.missions.find((item) => item.id === id);
    if (!mission) return;

    const confirmed = window.confirm(
      `Delete Skill ${mission.number}: "${mission.title}"?`
    );

    if (!confirmed) return;

    const remaining = adventure.missions.filter((item) => item.id !== id);

    onUpdate({
      ...adventure,
      updated: new Date().toISOString(),
      missions: remaining,
      activity: [`Skill ${mission.number} deleted`, ...adventure.activity]
    });

    setActiveMissionId(remaining[0]?.id ?? null);
  }

  function publishHtml() {
    publishAdventureHtml(adventure);

    onUpdate({
      ...adventure,
      updated: new Date().toISOString(),
      activity: ["HTML edition published", ...adventure.activity]
    });
  }

  return (
    <main className="page-shell">
      <section className="workspace-header">
        <div>
          <button className="link-button" onClick={onBack}>
            ← Adventure Library
          </button>
          <p className="eyebrow">Adventure Workspace</p>
          <h1>{adventure.title}</h1>
          <p>{adventure.summary}</p>
        </div>

        <div className="workspace-meta">
          <span className={`status-badge ${adventure.status}`}>
            {adventure.status}
          </span>
          <span>Version {adventure.version}</span>
        </div>
      </section>

      <section className="panel adventure-overview">
        <h2>Adventure Information</h2>

        <label>
          Purpose
          <textarea
            value={adventure.purpose}
            onChange={(event) =>
              onUpdate({
                ...adventure,
                purpose: event.target.value,
                updated: new Date().toISOString()
              })
            }
          />
        </label>

        <label>
          Audience
          <textarea
            value={adventure.audience}
            onChange={(event) =>
              onUpdate({
                ...adventure,
                audience: event.target.value,
                updated: new Date().toISOString()
              })
            }
          />
        </label>

        <label>
          Confidence Outcome
          <textarea
            value={adventure.confidenceOutcome}
            onChange={(event) =>
              onUpdate({
                ...adventure,
                confidenceOutcome: event.target.value,
                updated: new Date().toISOString()
              })
            }
          />
        </label>
      </section>

      <section className="workspace-grid mission-workspace">
        <aside className="panel mission-list">
          <h2>Skills</h2>

          {adventure.missions.map((mission) => (
            <button
              key={mission.id}
              className={
                mission.id === activeMission?.id
                  ? "mission-list-item active"
                  : "mission-list-item"
              }
              onClick={() => setActiveMissionId(mission.id)}
            >
              <strong>Skill {String(mission.number).padStart(2, "0")}</strong>
              <span>{mission.title}</span>
            </button>
          ))}

          <button className="primary-button" onClick={addMission}>
            + Add Skill
          </button>
        </aside>

        <section className="panel mission-editor">
          {activeMission ? (
            <>
              <div className="mission-editor-header">
                <div>
                  <p className="eyebrow">
                    Skill {String(activeMission.number).padStart(2, "0")}
                  </p>
                  <h2>{activeMission.title}</h2>
                </div>

                <button
                  className="danger-link"
                  onClick={() => deleteMission(activeMission.id)}
                >
                  Delete Skill
                </button>
              </div>

              <label>
                Title
                <input
                  value={activeMission.title}
                  onChange={(event) =>
                    updateMission({
                      ...activeMission,
                      title: event.target.value
                    })
                  }
                />
              </label>

              <label>
                Goal
                <textarea
                  value={activeMission.goal}
                  onChange={(event) =>
                    updateMission({
                      ...activeMission,
                      goal: event.target.value
                    })
                  }
                />
              </label>

              <label>
                Real-World Action
                <textarea
                  value={activeMission.realWorldAction}
                  onChange={(event) =>
                    updateMission({
                      ...activeMission,
                      realWorldAction: event.target.value
                    })
                  }
                />
              </label>

              <label>
                Confidence Question
                <textarea
                  value={activeMission.confidenceQuestion}
                  onChange={(event) =>
                    updateMission({
                      ...activeMission,
                      confidenceQuestion: event.target.value
                    })
                  }
                />
              </label>

              <hr />

              <h2>Skill Elements</h2>

              {activeMission.elements.length === 0 ? (
                <p>No Skill Elements yet.</p>
              ) : (
                activeMission.elements.map((element) => (
                  <article className="mission-element-card" key={element.id}>
                    <strong>{element.type}</strong>
                    <h3>{element.title}</h3>
                    <p>{element.body}</p>
                  </article>
                ))
              )}
            </>
          ) : (
            <p>Create a Skill to begin authoring.</p>
          )}
        </section>

        <aside className="panel activity-panel">
          <h2>Recent Activity</h2>

          <ul>
            {adventure.activity.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>

          <hr />

          <h2>Publishing</h2>
          <button className="primary-button" onClick={publishHtml}>
            Publish HTML
          </button>
          <p className="autosave-note">
            Downloads a self-contained web page that opens in any browser.
          </p>

          <hr />

          <button
            className="danger-link"
            onClick={() => onDelete(adventure.id)}
          >
            Delete Adventure
          </button>
        </aside>
      </section>
    </main>
  );
}
