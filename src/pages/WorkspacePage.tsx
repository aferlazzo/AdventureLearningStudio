import { useState } from "react";
import type {
  Adventure,
  Mission,
  MissionElement,
  MissionElementType
} from "../models/adventure";
import { publishAdventureHtml } from "../services/htmlPublisher";

interface WorkspacePageProps {
  adventure: Adventure;
  onBack: () => void;
  onDelete: (id: string) => void;
  onUpdate: (adventure: Adventure) => void;
}

const elementTypes: MissionElementType[] = [
  "Story",
  "Comic Panel",
  "Instruction",
  "Warning",
  "Tip",
  "Question"
];

function createElement(type: MissionElementType): MissionElement {
  return {
    id: crypto.randomUUID(),
    type,
    title: type === "Comic Panel" ? "New comic panel" : `New ${type}`,
    body: "",
    ...(type === "Comic Panel"
      ? {
          imageUrl: "",
          altText: "",
          dialogue: "",
          thought: "",
          caption: "",
          teachingNote: ""
        }
      : {})
  };
}

function ComicPanelPreview({ element }: { element: MissionElement }) {
  return (
    <article className="comic-preview-card">
      <div className="comic-preview-image">
        {element.imageUrl ? (
          <img src={element.imageUrl} alt={element.altText || "Comic panel"} />
        ) : (
          <div className="comic-image-placeholder">
            <span>Comic image</span>
            <small>Add an image URL to preview the artwork.</small>
          </div>
        )}

        {element.dialogue && (
          <div className="speech-bubble">{element.dialogue}</div>
        )}

        {element.thought && (
          <div className="thought-bubble">{element.thought}</div>
        )}
      </div>

      {(element.title || element.caption) && (
        <div className="comic-preview-copy">
          {element.title && <h3>{element.title}</h3>}
          {element.caption && <p>{element.caption}</p>}
        </div>
      )}

      {element.teachingNote && (
        <aside className="comic-teaching-note">
          <strong>Learning moment</strong>
          <p>{element.teachingNote}</p>
        </aside>
      )}
    </article>
  );
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
  const [newElementType, setNewElementType] =
    useState<MissionElementType>("Comic Panel");
  const [previewOpen, setPreviewOpen] = useState(true);

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
      title: "Untitled Mission",
      goal: "",
      realWorldAction: "",
      confidenceQuestion: "",
      elements: []
    };

    onUpdate({
      ...adventure,
      updated: new Date().toISOString(),
      missions: [...adventure.missions, mission],
      activity: [`Mission ${nextNumber} created`, ...adventure.activity]
    });

    setActiveMissionId(mission.id);
  }

  function deleteMission(id: string) {
    const mission = adventure.missions.find((item) => item.id === id);
    if (!mission) return;

    const confirmed = window.confirm(
      `Delete Mission ${mission.number}: "${mission.title}"?`
    );

    if (!confirmed) return;

    const remaining = adventure.missions.filter((item) => item.id !== id);

    onUpdate({
      ...adventure,
      updated: new Date().toISOString(),
      missions: remaining,
      activity: [`Mission ${mission.number} deleted`, ...adventure.activity]
    });

    setActiveMissionId(remaining[0]?.id ?? null);
  }

  function addElement() {
    if (!activeMission) return;

    updateMission({
      ...activeMission,
      elements: [...activeMission.elements, createElement(newElementType)]
    });
  }

  function updateElement(updatedElement: MissionElement) {
    if (!activeMission) return;

    updateMission({
      ...activeMission,
      elements: activeMission.elements.map((element) =>
        element.id === updatedElement.id ? updatedElement : element
      )
    });
  }

  function deleteElement(id: string) {
    if (!activeMission) return;

    updateMission({
      ...activeMission,
      elements: activeMission.elements.filter((element) => element.id !== id)
    });
  }

  function duplicateElement(element: MissionElement) {
    if (!activeMission) return;

    const index = activeMission.elements.findIndex(
      (candidate) => candidate.id === element.id
    );
    const duplicate = {
      ...element,
      id: crypto.randomUUID(),
      title: element.title ? `${element.title} copy` : "Copy"
    };
    const next = [...activeMission.elements];
    next.splice(index + 1, 0, duplicate);

    updateMission({ ...activeMission, elements: next });
  }

  function moveElement(id: string, direction: -1 | 1) {
    if (!activeMission) return;

    const currentIndex = activeMission.elements.findIndex(
      (element) => element.id === id
    );
    const nextIndex = currentIndex + direction;

    if (
      currentIndex < 0 ||
      nextIndex < 0 ||
      nextIndex >= activeMission.elements.length
    ) {
      return;
    }

    const next = [...activeMission.elements];
    [next[currentIndex], next[nextIndex]] = [
      next[nextIndex],
      next[currentIndex]
    ];
    updateMission({ ...activeMission, elements: next });
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
          <h2>Missions</h2>

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
              <strong>Mission {String(mission.number).padStart(2, "0")}</strong>
              <span>{mission.title}</span>
            </button>
          ))}

          <button className="primary-button" onClick={addMission}>
            + Add Mission
          </button>
        </aside>

        <section className="panel mission-editor">
          {activeMission ? (
            <>
              <div className="mission-editor-header">
                <div>
                  <p className="eyebrow">
                    Mission {String(activeMission.number).padStart(2, "0")}
                  </p>
                  <h2>{activeMission.title}</h2>
                </div>

                <button
                  className="danger-link"
                  onClick={() => deleteMission(activeMission.id)}
                >
                  Delete Mission
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

              <div className="element-builder-heading">
                <div>
                  <p className="eyebrow">Comic-infused sequence</p>
                  <h2>Mission Elements</h2>
                </div>
                <button
                  className="secondary-button"
                  onClick={() => setPreviewOpen((open) => !open)}
                >
                  {previewOpen ? "Hide Preview" : "Show Preview"}
                </button>
              </div>

              <div className="add-element-bar">
                <select
                  value={newElementType}
                  onChange={(event) =>
                    setNewElementType(event.target.value as MissionElementType)
                  }
                  aria-label="Element type"
                >
                  {elementTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <button className="primary-button" onClick={addElement}>
                  + Add {newElementType}
                </button>
              </div>

              {activeMission.elements.length === 0 ? (
                <div className="empty-builder-state">
                  <h3>Start the learner’s journey</h3>
                  <p>
                    Add a Comic Panel, Story, or Instruction. Elements can be
                    rearranged so story and teaching unfold together.
                  </p>
                </div>
              ) : (
                <div className={previewOpen ? "builder-with-preview" : ""}>
                  <div className="element-editor-list">
                    {activeMission.elements.map((element, index) => (
                      <article className="element-editor-card" key={element.id}>
                        <div className="element-card-toolbar">
                          <div>
                            <span className="element-order">{index + 1}</span>
                            <strong>{element.type}</strong>
                          </div>
                          <div className="element-actions">
                            <button
                              className="icon-button"
                              onClick={() => moveElement(element.id, -1)}
                              disabled={index === 0}
                              aria-label="Move element up"
                              title="Move up"
                            >
                              ↑
                            </button>
                            <button
                              className="icon-button"
                              onClick={() => moveElement(element.id, 1)}
                              disabled={
                                index === activeMission.elements.length - 1
                              }
                              aria-label="Move element down"
                              title="Move down"
                            >
                              ↓
                            </button>
                            <button
                              className="icon-button"
                              onClick={() => duplicateElement(element)}
                              aria-label="Duplicate element"
                              title="Duplicate"
                            >
                              ⧉
                            </button>
                            <button
                              className="danger-link"
                              onClick={() => deleteElement(element.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <label>
                          Element type
                          <select
                            value={element.type}
                            onChange={(event) =>
                              updateElement({
                                ...element,
                                type: event.target.value as MissionElementType
                              })
                            }
                          >
                            {elementTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label>
                          Title
                          <input
                            value={element.title}
                            onChange={(event) =>
                              updateElement({
                                ...element,
                                title: event.target.value
                              })
                            }
                          />
                        </label>

                        {element.type === "Comic Panel" ? (
                          <div className="comic-panel-fields">
                            <label>
                              Image URL
                              <input
                                type="url"
                                value={element.imageUrl ?? ""}
                                placeholder="https://example.com/panel.png"
                                onChange={(event) =>
                                  updateElement({
                                    ...element,
                                    imageUrl: event.target.value
                                  })
                                }
                              />
                            </label>

                            <label>
                              Alternative text
                              <input
                                value={element.altText ?? ""}
                                placeholder="Describe what the learner sees"
                                onChange={(event) =>
                                  updateElement({
                                    ...element,
                                    altText: event.target.value
                                  })
                                }
                              />
                            </label>

                            <label>
                              Dialogue
                              <textarea
                                value={element.dialogue ?? ""}
                                placeholder="What does the character say?"
                                onChange={(event) =>
                                  updateElement({
                                    ...element,
                                    dialogue: event.target.value
                                  })
                                }
                              />
                            </label>

                            <label>
                              Thought
                              <textarea
                                value={element.thought ?? ""}
                                placeholder="What is the character thinking?"
                                onChange={(event) =>
                                  updateElement({
                                    ...element,
                                    thought: event.target.value
                                  })
                                }
                              />
                            </label>

                            <label>
                              Caption
                              <textarea
                                value={element.caption ?? ""}
                                placeholder="Narration beneath the panel"
                                onChange={(event) =>
                                  updateElement({
                                    ...element,
                                    caption: event.target.value
                                  })
                                }
                              />
                            </label>

                            <label>
                              Learning moment
                              <textarea
                                value={element.teachingNote ?? ""}
                                placeholder="What should the learner notice here?"
                                onChange={(event) =>
                                  updateElement({
                                    ...element,
                                    teachingNote: event.target.value
                                  })
                                }
                              />
                            </label>
                          </div>
                        ) : (
                          <label>
                            Content
                            <textarea
                              value={element.body}
                              placeholder="Write the learner-facing content"
                              onChange={(event) =>
                                updateElement({
                                  ...element,
                                  body: event.target.value
                                })
                              }
                            />
                          </label>
                        )}
                      </article>
                    ))}
                  </div>

                  {previewOpen && (
                    <aside className="mission-preview-pane">
                      <div className="preview-sticky-heading">
                        <p className="eyebrow">Learner preview</p>
                        <h2>{activeMission.title}</h2>
                      </div>

                      {activeMission.elements.map((element) =>
                        element.type === "Comic Panel" ? (
                          <ComicPanelPreview
                            key={element.id}
                            element={element}
                          />
                        ) : (
                          <article
                            className={`learner-element-preview ${element.type
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            key={element.id}
                          >
                            <p className="eyebrow">{element.type}</p>
                            {element.title && <h3>{element.title}</h3>}
                            {element.body ? (
                              <p>{element.body}</p>
                            ) : (
                              <p className="preview-empty">No content yet.</p>
                            )}
                          </article>
                        )
                      )}
                    </aside>
                  )}
                </div>
              )}
            </>
          ) : (
            <p>Create a Mission to begin authoring.</p>
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
