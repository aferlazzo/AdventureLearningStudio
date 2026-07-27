import { useEffect, useState, type ChangeEvent } from "react";
import type { Adventure, Mission, MissionElement, MissionElementType } from "../models/adventure";
import { publishAdventureHtml } from "../services/htmlPublisher";

type AuthoringView = "setup" | "sequence" | "preview";

interface WorkspacePageProps {
  adventure: Adventure;
  onBack: () => void;
  onDelete: (id: string) => void;
  onUpdate: (adventure: Adventure) => void;
}

const elementTypes: MissionElementType[] = ["Story", "Comic Panel", "Instruction", "Warning", "Tip", "Question"];
const MAX_IMAGE_DIMENSION = 1600;
const JPEG_QUALITY = 0.84;

function createElement(type: MissionElementType): MissionElement {
  return {
    id: crypto.randomUUID(),
    type,
    title: type === "Comic Panel" ? "New comic panel" : `New ${type}`,
    body: "",
    ...(type === "Comic Panel" ? {
      imageUrl: "", imageDataUrl: "", imageFileName: "", altText: "",
      dialogue: "", thought: "", caption: "", teachingNote: ""
    } : {})
  };
}

function imageSource(element: MissionElement): string {
  return element.imageDataUrl || element.imageUrl || "";
}

function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("The image could not be read."));
    reader.readAsDataURL(file);
  });
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The selected file is not a usable image."));
    image.src = source;
  });
}

async function prepareImage(file: File): Promise<string> {
  const source = await readImageFile(file);
  const image = await loadImage(source);
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser cannot prepare the image.");
  context.drawImage(image, 0, 0, width, height);
  const preserveTransparency = file.type === "image/png" || file.type === "image/webp";
  return canvas.toDataURL(preserveTransparency ? file.type : "image/jpeg", preserveTransparency ? undefined : JPEG_QUALITY);
}

function ComicPanelPreview({ element }: { element: MissionElement }) {
  const source = imageSource(element);
  return (
    <article className="comic-preview-card">
      <div className="comic-preview-image">
        {source ? <img src={source} alt={element.altText || "Comic panel"} /> : (
          <div className="comic-image-placeholder"><span>Comic image</span><small>Select an image or enter an image URL.</small></div>
        )}
        {element.dialogue && <div className="speech-bubble">{element.dialogue}</div>}
        {element.thought && <div className="thought-bubble">{element.thought}</div>}
      </div>
      {(element.title || element.caption) && <div className="comic-preview-copy">{element.title && <h3>{element.title}</h3>}{element.caption && <p>{element.caption}</p>}</div>}
      {element.teachingNote && <aside className="comic-teaching-note"><strong>Learning moment</strong><p>{element.teachingNote}</p></aside>}
    </article>
  );
}

function missionCompletion(mission: Mission): { setup: boolean; sequence: boolean; practice: boolean; score: number } {
  const setup = Boolean(mission.title.trim() && mission.goal.trim());
  const sequence = mission.elements.length > 0;
  const practice = Boolean(mission.realWorldAction.trim() && mission.confidenceQuestion.trim());
  return { setup, sequence, practice, score: [setup, sequence, practice].filter(Boolean).length };
}

function elementSummary(element: MissionElement): string {
  if (element.type === "Comic Panel") {
    return element.caption || element.dialogue || element.thought || (imageSource(element) ? "Artwork added" : "Add artwork and story");
  }
  return element.body || "Add learner-facing content";
}

export function WorkspacePage({ adventure, onBack, onDelete, onUpdate }: WorkspacePageProps) {
  const [activeMissionId, setActiveMissionId] = useState<string | null>(adventure.missions[0]?.id ?? null);
  const [newElementType, setNewElementType] = useState<MissionElementType>("Comic Panel");
  const [authoringView, setAuthoringView] = useState<AuthoringView>("setup");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [adventureInfoOpen, setAdventureInfoOpen] = useState(false);

  const activeMission = adventure.missions.find((mission) => mission.id === activeMissionId) ?? adventure.missions[0];
  const completion = activeMission ? missionCompletion(activeMission) : null;
  const selectedElement = activeMission?.elements.find((element) => element.id === selectedElementId) ?? activeMission?.elements[0];
  const selectedIndex = selectedElement && activeMission ? activeMission.elements.findIndex((element) => element.id === selectedElement.id) : -1;

  useEffect(() => {
    if (!activeMission) {
      setSelectedElementId(null);
      return;
    }
    if (!activeMission.elements.some((element) => element.id === selectedElementId)) {
      setSelectedElementId(activeMission.elements[0]?.id ?? null);
    }
  }, [activeMission, selectedElementId]);

  function updateMission(updatedMission: Mission) {
    onUpdate({
      ...adventure,
      updated: new Date().toISOString(),
      missions: adventure.missions.map((mission) => mission.id === updatedMission.id ? updatedMission : mission)
    });
  }

  function chooseMission(id: string) {
    const mission = adventure.missions.find((item) => item.id === id);
    setActiveMissionId(id);
    setSelectedElementId(mission?.elements[0]?.id ?? null);
    setAuthoringView("setup");
  }

  function addMission() {
    const nextNumber = adventure.missions.length === 0 ? 0 : Math.max(...adventure.missions.map((mission) => mission.number)) + 1;
    const mission: Mission = { id: crypto.randomUUID(), number: nextNumber, title: "Untitled Mission", goal: "", realWorldAction: "", confidenceQuestion: "", elements: [] };
    onUpdate({ ...adventure, updated: new Date().toISOString(), missions: [...adventure.missions, mission], activity: [`Mission ${nextNumber} created`, ...adventure.activity] });
    setActiveMissionId(mission.id);
    setSelectedElementId(null);
    setAuthoringView("setup");
  }

  function deleteMission(id: string) {
    const mission = adventure.missions.find((item) => item.id === id);
    if (!mission || !window.confirm(`Delete Mission ${mission.number}: "${mission.title}"?`)) return;
    const remaining = adventure.missions.filter((item) => item.id !== id);
    onUpdate({ ...adventure, updated: new Date().toISOString(), missions: remaining, activity: [`Mission ${mission.number} deleted`, ...adventure.activity] });
    setActiveMissionId(remaining[0]?.id ?? null);
    setSelectedElementId(remaining[0]?.elements[0]?.id ?? null);
    setAuthoringView("setup");
  }

  function addElement() {
    if (!activeMission) return;
    const element = createElement(newElementType);
    updateMission({ ...activeMission, elements: [...activeMission.elements, element] });
    setSelectedElementId(element.id);
  }

  function updateElement(updatedElement: MissionElement) {
    if (!activeMission) return;
    updateMission({ ...activeMission, elements: activeMission.elements.map((element) => element.id === updatedElement.id ? updatedElement : element) });
  }

  function deleteElement(id: string) {
    if (!activeMission) return;
    const index = activeMission.elements.findIndex((element) => element.id === id);
    const next = activeMission.elements.filter((element) => element.id !== id);
    updateMission({ ...activeMission, elements: next });
    setSelectedElementId(next[Math.min(index, next.length - 1)]?.id ?? null);
  }

  function duplicateElement(element: MissionElement) {
    if (!activeMission) return;
    const index = activeMission.elements.findIndex((item) => item.id === element.id);
    const duplicate = { ...element, id: crypto.randomUUID(), title: element.title ? `${element.title} copy` : "Copy" };
    const next = [...activeMission.elements];
    next.splice(index + 1, 0, duplicate);
    updateMission({ ...activeMission, elements: next });
    setSelectedElementId(duplicate.id);
  }

  function moveElement(id: string, direction: -1 | 1) {
    if (!activeMission) return;
    const currentIndex = activeMission.elements.findIndex((element) => element.id === id);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= activeMission.elements.length) return;
    const next = [...activeMission.elements];
    [next[currentIndex], next[nextIndex]] = [next[nextIndex], next[currentIndex]];
    updateMission({ ...activeMission, elements: next });
  }

  async function selectPanelImage(event: ChangeEvent<HTMLInputElement>, element: MissionElement) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { setImageError("Please select a PNG, JPEG, WebP, GIF, or other image file."); return; }
    try {
      setImageError("");
      const dataUrl = await prepareImage(file);
      updateElement({ ...element, imageDataUrl: dataUrl, imageFileName: file.name, imageUrl: "" });
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "The image could not be added.");
    }
  }

  function removePanelImage(element: MissionElement) {
    updateElement({ ...element, imageDataUrl: "", imageFileName: "", imageUrl: "" });
  }

  function publishHtml() {
    publishAdventureHtml(adventure);
    onUpdate({ ...adventure, updated: new Date().toISOString(), activity: ["HTML edition published", ...adventure.activity] });
  }

  return (
    <main className="page-shell guided-workspace">
      <section className="workspace-header">
        <div><button className="link-button" onClick={onBack}>← Adventure Library</button><p className="eyebrow">Adventure Workspace</p><h1>{adventure.title}</h1><p>{adventure.summary}</p></div>
        <div className="workspace-meta"><span className={`status-badge ${adventure.status}`}>{adventure.status}</span><span>Version {adventure.version}</span></div>
      </section>

      <section className="panel adventure-overview compact-overview">
        <button className="overview-toggle" onClick={() => setAdventureInfoOpen((open) => !open)} aria-expanded={adventureInfoOpen}>
          <span><strong>Adventure foundation</strong><small>Purpose, audience, and confidence outcome</small></span><span>{adventureInfoOpen ? "Hide" : "Edit"}</span>
        </button>
        {adventureInfoOpen && <div className="overview-fields">
          <label>Purpose<textarea value={adventure.purpose} onChange={(event) => onUpdate({ ...adventure, purpose: event.target.value, updated: new Date().toISOString() })} /></label>
          <label>Audience<textarea value={adventure.audience} onChange={(event) => onUpdate({ ...adventure, audience: event.target.value, updated: new Date().toISOString() })} /></label>
          <label>Confidence Outcome<textarea value={adventure.confidenceOutcome} onChange={(event) => onUpdate({ ...adventure, confidenceOutcome: event.target.value, updated: new Date().toISOString() })} /></label>
        </div>}
      </section>

      <section className="workspace-grid mission-workspace">
        <aside className="panel mission-list">
          <div className="mission-list-heading"><div><p className="eyebrow">Adventure path</p><h2>Missions</h2></div><span>{adventure.missions.length}</span></div>
          {adventure.missions.map((mission) => {
            const status = missionCompletion(mission);
            return <button key={mission.id} className={mission.id === activeMission?.id ? "mission-list-item active" : "mission-list-item"} onClick={() => chooseMission(mission.id)}>
              <span className="mission-list-number">{String(mission.number).padStart(2, "0")}</span>
              <span className="mission-list-copy"><strong>{mission.title}</strong><small>{status.score} of 3 steps ready</small></span>
            </button>;
          })}
          <button className="primary-button add-mission-button" onClick={addMission}>+ Add Mission</button>
        </aside>

        <section className="panel mission-editor guided-mission-editor">
          {activeMission && completion ? <>
            <div className="mission-editor-header"><div><p className="eyebrow">Mission {String(activeMission.number).padStart(2, "0")}</p><h2>{activeMission.title}</h2></div><button className="danger-link" onClick={() => deleteMission(activeMission.id)}>Delete Mission</button></div>

            <nav className="authoring-steps" aria-label="Mission authoring steps">
              <button className={authoringView === "setup" ? "active" : ""} onClick={() => setAuthoringView("setup")}><span className={completion.setup ? "step-check complete" : "step-check"}>{completion.setup ? "✓" : "1"}</span><span><strong>Set up</strong><small>Goal and practice</small></span></button>
              <button className={authoringView === "sequence" ? "active" : ""} onClick={() => setAuthoringView("sequence")}><span className={completion.sequence ? "step-check complete" : "step-check"}>{completion.sequence ? "✓" : "2"}</span><span><strong>Build</strong><small>Story and teaching</small></span></button>
              <button className={authoringView === "preview" ? "active" : ""} onClick={() => setAuthoringView("preview")}><span className={completion.practice ? "step-check complete" : "step-check"}>{completion.practice ? "✓" : "3"}</span><span><strong>Preview</strong><small>Learner experience</small></span></button>
            </nav>

            {authoringView === "setup" && <section className="authoring-stage setup-stage">
              <div className="stage-heading"><p className="eyebrow">Step 1</p><h2>Define the learner’s victory</h2><p>State what the learner will understand, try, and feel confident doing.</p></div>
              <label>Mission title<input value={activeMission.title} onChange={(event) => updateMission({ ...activeMission, title: event.target.value })} /></label>
              <label>Goal<textarea value={activeMission.goal} placeholder="What will the learner be able to do?" onChange={(event) => updateMission({ ...activeMission, goal: event.target.value })} /></label>
              <label>Real-world action<textarea value={activeMission.realWorldAction} placeholder="What should the learner try?" onChange={(event) => updateMission({ ...activeMission, realWorldAction: event.target.value })} /></label>
              <label>Confidence question<textarea value={activeMission.confidenceQuestion} placeholder="How will the learner judge readiness?" onChange={(event) => updateMission({ ...activeMission, confidenceQuestion: event.target.value })} /></label>
              <div className="stage-actions"><span>{completion.setup && completion.practice ? "Mission foundation ready" : "Complete the four fields to shape the mission."}</span><button className="primary-button" onClick={() => setAuthoringView("sequence")}>Build the sequence →</button></div>
            </section>}

            {authoringView === "sequence" && <section className="authoring-stage sequence-stage focused-sequence-stage">
              <div className="stage-heading"><p className="eyebrow">Step 2</p><h2>Build the learner’s journey</h2><p>Use the strip to select a moment, then focus on shaping that single part of the experience.</p></div>
              <div className="add-element-bar"><select value={newElementType} onChange={(event) => setNewElementType(event.target.value as MissionElementType)} aria-label="Element type">{elementTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select><button className="primary-button" onClick={addElement}>+ Add {newElementType}</button></div>
              {imageError && <p className="image-upload-error" role="alert">{imageError}</p>}

              {activeMission.elements.length === 0 ? <div className="empty-builder-state"><h3>Start with the situation</h3><p>Add a Story or Comic Panel that places the learner inside a real-world moment.</p></div> : <>
                <div className="sequence-strip" role="list" aria-label="Mission sequence">
                  {activeMission.elements.map((element, index) => <button type="button" role="listitem" key={element.id} className={element.id === selectedElement?.id ? "sequence-tile active" : "sequence-tile"} onClick={() => setSelectedElementId(element.id)}>
                    <span className="sequence-tile-number">{index + 1}</span>
                    {element.type === "Comic Panel" && imageSource(element) ? <img src={imageSource(element)} alt="" /> : <span className={`sequence-type-icon ${element.type.toLowerCase().replace(/\s+/g, "-")}`}>{element.type === "Comic Panel" ? "▧" : element.type.charAt(0)}</span>}
                    <strong>{element.type}</strong>
                    <small>{element.title || "Untitled"}</small>
                  </button>)}
                </div>

                {selectedElement && <div className="focused-element-workspace">
                  <div className="focused-element-header">
                    <div><p className="eyebrow">Moment {selectedIndex + 1} of {activeMission.elements.length}</p><h3>{selectedElement.type}</h3><p>{elementSummary(selectedElement)}</p></div>
                    <div className="element-actions"><button className="icon-button" onClick={() => moveElement(selectedElement.id, -1)} disabled={selectedIndex === 0} title="Move earlier">←</button><button className="icon-button" onClick={() => moveElement(selectedElement.id, 1)} disabled={selectedIndex === activeMission.elements.length - 1} title="Move later">→</button><button className="icon-button" onClick={() => duplicateElement(selectedElement)} title="Duplicate">⧉</button><button className="danger-link" onClick={() => deleteElement(selectedElement.id)}>Delete</button></div>
                  </div>

                  <div className="focused-element-grid">
                    <div className="focused-element-form">
                      <label>Element type<select value={selectedElement.type} onChange={(event) => updateElement({ ...selectedElement, type: event.target.value as MissionElementType })}>{elementTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
                      <label>Title<input value={selectedElement.title} onChange={(event) => updateElement({ ...selectedElement, title: event.target.value })} /></label>
                      {selectedElement.type === "Comic Panel" ? <div className="comic-panel-fields">
                        <div className="image-picker-block"><span className="field-label">Panel artwork</span><div className="image-picker-actions"><label className="secondary-button file-picker-button">Select image<input type="file" accept="image/*" onChange={(event) => void selectPanelImage(event, selectedElement)} /></label>{imageSource(selectedElement) && <button className="danger-link" type="button" onClick={() => removePanelImage(selectedElement)}>Remove image</button>}</div>{selectedElement.imageFileName && <small className="selected-file-name">Embedded: {selectedElement.imageFileName}</small>}<small>Large images are resized to fit within {MAX_IMAGE_DIMENSION}px before being saved.</small></div>
                        <label>Or use an image URL<input type="url" value={selectedElement.imageUrl ?? ""} placeholder="https://example.com/panel.png" onChange={(event) => updateElement({ ...selectedElement, imageUrl: event.target.value, imageDataUrl: "", imageFileName: "" })} /></label>
                        <label>Alternative text<input value={selectedElement.altText ?? ""} placeholder="Describe what the learner sees" onChange={(event) => updateElement({ ...selectedElement, altText: event.target.value })} /></label>
                        <label>Dialogue<textarea value={selectedElement.dialogue ?? ""} placeholder="What does the character say?" onChange={(event) => updateElement({ ...selectedElement, dialogue: event.target.value })} /></label>
                        <label>Thought<textarea value={selectedElement.thought ?? ""} placeholder="What is the character thinking?" onChange={(event) => updateElement({ ...selectedElement, thought: event.target.value })} /></label>
                        <label>Caption<textarea value={selectedElement.caption ?? ""} placeholder="Narration beneath the panel" onChange={(event) => updateElement({ ...selectedElement, caption: event.target.value })} /></label>
                        <label>Learning moment<textarea value={selectedElement.teachingNote ?? ""} placeholder="What should the learner notice here?" onChange={(event) => updateElement({ ...selectedElement, teachingNote: event.target.value })} /></label>
                      </div> : <label>Content<textarea value={selectedElement.body} placeholder="Write the learner-facing content" onChange={(event) => updateElement({ ...selectedElement, body: event.target.value })} /></label>}
                    </div>

                    <aside className="focused-element-preview"><p className="eyebrow">This moment</p>{selectedElement.type === "Comic Panel" ? <ComicPanelPreview element={selectedElement} /> : <article className={`learner-element-preview ${selectedElement.type.toLowerCase().replace(/\s+/g, "-")}`}><p className="eyebrow">{selectedElement.type}</p>{selectedElement.title && <h3>{selectedElement.title}</h3>}{selectedElement.body ? <p>{selectedElement.body}</p> : <p className="preview-empty">No content yet.</p>}</article>}</aside>
                  </div>

                  <div className="focused-navigation"><button className="secondary-button" disabled={selectedIndex <= 0} onClick={() => setSelectedElementId(activeMission.elements[selectedIndex - 1]?.id ?? null)}>← Previous moment</button><span>{selectedIndex + 1} / {activeMission.elements.length}</span><button className="secondary-button" disabled={selectedIndex >= activeMission.elements.length - 1} onClick={() => setSelectedElementId(activeMission.elements[selectedIndex + 1]?.id ?? null)}>Next moment →</button></div>
                </div>}
              </>}
              <div className="stage-actions"><button className="secondary-button" onClick={() => setAuthoringView("setup")}>← Mission setup</button><button className="primary-button" onClick={() => setAuthoringView("preview")}>Preview the mission →</button></div>
            </section>}

            {authoringView === "preview" && <section className="authoring-stage preview-stage">
              <div className="stage-heading"><p className="eyebrow">Step 3</p><h2>Experience the mission as a learner</h2><p>Read it in order. Look for missing context, abrupt transitions, or instructions that arrive too early.</p></div>
              <div className="full-mission-preview">
                <header><p className="eyebrow">Mission {String(activeMission.number).padStart(2, "0")}</p><h2>{activeMission.title}</h2>{activeMission.goal && <p className="preview-goal">{activeMission.goal}</p>}</header>
                {activeMission.elements.length === 0 ? <p className="preview-empty">Build the sequence before previewing it.</p> : activeMission.elements.map((element) => element.type === "Comic Panel" ? <ComicPanelPreview key={element.id} element={element} /> : <article className={`learner-element-preview ${element.type.toLowerCase().replace(/\s+/g, "-")}`} key={element.id}><p className="eyebrow">{element.type}</p>{element.title && <h3>{element.title}</h3>}{element.body ? <p>{element.body}</p> : <p className="preview-empty">No content yet.</p>}</article>)}
                {activeMission.realWorldAction && <section className="preview-practice"><p className="eyebrow">Try it yourself</p><h3>Practice in the real world</h3><p>{activeMission.realWorldAction}</p></section>}
                {activeMission.confidenceQuestion && <section className="preview-confidence"><p className="eyebrow">Confidence check</p><h3>{activeMission.confidenceQuestion}</h3></section>}
              </div>
              <div className="stage-actions"><button className="secondary-button" onClick={() => setAuthoringView("sequence")}>← Revise sequence</button><button className="primary-button" onClick={publishHtml}>Publish HTML</button></div>
            </section>}
          </> : <div className="empty-builder-state"><h2>Create the first mission</h2><p>Each mission should give the learner one practical confidence-building victory.</p><button className="primary-button" onClick={addMission}>+ Add Mission</button></div>}
        </section>

        <aside className="panel activity-panel guided-side-panel">
          <h2>Mission readiness</h2>
          {completion ? <div className="readiness-list"><button onClick={() => setAuthoringView("setup")} className={completion.setup ? "complete" : ""}><span>{completion.setup ? "✓" : "○"}</span><span><strong>Clear goal</strong><small>Title and goal</small></span></button><button onClick={() => setAuthoringView("sequence")} className={completion.sequence ? "complete" : ""}><span>{completion.sequence ? "✓" : "○"}</span><span><strong>Learning journey</strong><small>{activeMission?.elements.length ?? 0} elements</small></span></button><button onClick={() => setAuthoringView("setup")} className={completion.practice ? "complete" : ""}><span>{completion.practice ? "✓" : "○"}</span><span><strong>Practice and confidence</strong><small>Real-world finish</small></span></button></div> : <p>Add a mission to begin.</p>}
          <hr /><h2>Publishing</h2><button className="primary-button" onClick={publishHtml} disabled={!activeMission}>Publish HTML</button><p className="autosave-note">Downloads a self-contained web page with selected comic images embedded.</p>
          <hr /><details><summary>Recent activity</summary><ul>{adventure.activity.slice(0, 8).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></details>
          <hr /><button className="danger-link" onClick={() => onDelete(adventure.id)}>Delete Adventure</button>
        </aside>
      </section>
    </main>
  );
}
