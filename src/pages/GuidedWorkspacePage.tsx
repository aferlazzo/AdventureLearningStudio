import { useMemo, useState } from "react";
import type { Adventure, Mission, MissionElement } from "../models/adventure";
import { WorkspacePage } from "./WorkspacePage";

interface GuidedWorkspacePageProps {
  adventure: Adventure;
  onBack: () => void;
  onDelete: (id: string) => void;
  onUpdate: (adventure: Adventure) => void;
}

type GuideStep = "welcome" | "situation" | "learner" | "victory" | "story" | "practice" | "complete";

type PanelMoment = "notices" | "asks" | "mistake" | "discovers" | "acts" | "succeeds";

const feelings = ["Confused", "Nervous", "Frustrated", "Curious", "Embarrassed", "Calm"];
const moments: { id: PanelMoment; title: string; prompt: string }[] = [
  { id: "notices", title: "Notices something", prompt: "What does the character notice first?" },
  { id: "asks", title: "Asks a question", prompt: "What question is running through their mind?" },
  { id: "mistake", title: "Makes a mistake", prompt: "What tempting mistake could they make?" },
  { id: "discovers", title: "Discovers something", prompt: "What useful fact changes their understanding?" },
  { id: "acts", title: "Takes action", prompt: "What safe action do they take next?" },
  { id: "succeeds", title: "Succeeds", prompt: "How does confidence look at the end?" }
];

function newMission(number: number): Mission {
  return { id: crypto.randomUUID(), number, title: "Untitled Mission", goal: "", realWorldAction: "", confidenceQuestion: "", elements: [] };
}

function panelFromMoment(moment: PanelMoment, scene: string, feeling: string): MissionElement {
  const title = moments.find((item) => item.id === moment)?.title ?? "Comic moment";
  const dialogueByMoment: Record<PanelMoment, string> = {
    notices: "Wait—what is that?",
    asks: "What should I do next?",
    mistake: "Maybe I should just ignore it.",
    discovers: "Oh, now I understand.",
    acts: "I know the safe next step.",
    succeeds: "I can handle this."
  };
  return {
    id: crypto.randomUUID(),
    type: "Comic Panel",
    title,
    body: "",
    imageUrl: "",
    imageDataUrl: "",
    imageFileName: "",
    altText: scene,
    dialogue: dialogueByMoment[moment],
    thought: feeling ? `${feeling}.` : "",
    caption: scene,
    teachingNote: moment === "discovers" ? "What should the learner understand at this moment?" : ""
  };
}

export function GuidedWorkspacePage(props: GuidedWorkspacePageProps) {
  const { adventure, onBack, onDelete, onUpdate } = props;
  const [advanced, setAdvanced] = useState(false);
  const [activeMissionId, setActiveMissionId] = useState(adventure.missions[0]?.id ?? "");
  const [step, setStep] = useState<GuideStep>(adventure.missions.length ? "situation" : "welcome");
  const [situation, setSituation] = useState("");
  const [feeling, setFeeling] = useState("");
  const [moment, setMoment] = useState<PanelMoment>("notices");
  const [scene, setScene] = useState("");

  const mission = useMemo(
    () => adventure.missions.find((item) => item.id === activeMissionId) ?? adventure.missions[0],
    [adventure.missions, activeMissionId]
  );

  const displayedSituation = situation || (mission?.title === "Untitled Mission" ? "" : mission?.title ?? "");

  if (advanced) {
    return <WorkspacePage {...props} />;
  }

  function persistMission(updatedMission: Mission, activity?: string) {
    onUpdate({
      ...adventure,
      updated: new Date().toISOString(),
      missions: adventure.missions.map((item) => item.id === updatedMission.id ? updatedMission : item),
      activity: activity ? [activity, ...adventure.activity] : adventure.activity
    });
  }

  function beginMission() {
    const number = adventure.missions.length === 0 ? 0 : Math.max(...adventure.missions.map((item) => item.number)) + 1;
    const created = newMission(number);
    onUpdate({
      ...adventure,
      updated: new Date().toISOString(),
      missions: [...adventure.missions, created],
      activity: [`Guided Mission ${number} started`, ...adventure.activity]
    });
    setActiveMissionId(created.id);
    setSituation("");
    setFeeling("");
    setScene("");
    setStep("situation");
  }

  function chooseMission(id: string) {
    const chosen = adventure.missions.find((item) => item.id === id);
    setActiveMissionId(id);
    setSituation(chosen && chosen.title !== "Untitled Mission" ? chosen.title : "");
    setFeeling("");
    setScene("");
    setStep("situation");
  }

  function saveSituation() {
    if (!mission) return;
    const nextSituation = displayedSituation.trim();
    if (!nextSituation) return;
    setSituation(nextSituation);
    persistMission({ ...mission, title: nextSituation });
    setStep("learner");
  }

  function saveVictory() {
    if (!mission || !mission.goal.trim()) return;
    setStep("story");
  }

  function addGuidedPanel() {
    if (!mission || !scene.trim()) return;
    const panel = panelFromMoment(moment, scene.trim(), feeling);
    persistMission({ ...mission, elements: [...mission.elements, panel] }, `${panel.title} panel added`);
    setScene("");
  }

  const currentMoment = moments.find((item) => item.id === moment)!;

  return (
    <main className="page-shell guide-shell">
      <header className="guide-header">
        <div>
          <button className="link-button" onClick={onBack}>← Adventure Library</button>
          <p className="eyebrow">Adventure Learning Studio</p>
          <h1>{adventure.title}</h1>
          <p>The Studio will guide you through one useful decision at a time.</p>
        </div>
        <button className="secondary-button" onClick={() => setAdvanced(true)}>Advanced editor</button>
      </header>

      <div className="guide-layout">
        <aside className="guide-rail panel">
          <p className="eyebrow">Guided path</p>
          {(["situation", "learner", "victory", "story", "practice", "complete"] as GuideStep[]).map((item, index) => (
            <button key={item} className={step === item ? "active" : ""} onClick={() => mission && setStep(item)} disabled={!mission}>
              <span>{index + 1}</span><strong>{["Situation", "Learner", "Victory", "Storyboard", "Practice", "Experience"][index]}</strong>
            </button>
          ))}
          <hr />
          <button className="primary-button" onClick={beginMission}>+ Guided Mission</button>
          {adventure.missions.map((item) => (
            <button key={item.id} className={item.id === mission?.id ? "mission-choice active" : "mission-choice"} onClick={() => chooseMission(item.id)}>
              Mission {String(item.number).padStart(2, "0")}<small>{item.title}</small>
            </button>
          ))}
        </aside>

        <section className="guide-card panel">
          {step === "welcome" && <div className="guide-welcome">
            <p className="eyebrow">Welcome</p>
            <h2>Let’s build a confidence-building mission together.</h2>
            <p>You do not need to begin with lesson fields. Begin with a real situation a learner recognizes.</p>
            <button className="primary-button" onClick={beginMission}>Begin guided mission →</button>
          </div>}

          {mission && step === "situation" && <>
            <p className="guide-step-count">Step 1 of 6</p>
            <p className="eyebrow">Begin with reality</p>
            <h2>What situation does the learner face?</h2>
            <p className="guide-coach">Use ordinary language. Examples: “A warning light comes on” or “The phone will not connect to the dashboard.”</p>
            <textarea className="guide-answer" autoFocus value={displayedSituation} onChange={(event) => setSituation(event.target.value)} placeholder="Describe the situation..." />
            <div className="guide-actions"><span>A recognizable situation gives the story somewhere to begin.</span><button className="primary-button" disabled={!displayedSituation.trim()} onClick={saveSituation}>Meet the learner →</button></div>
          </>}

          {mission && step === "learner" && <>
            <p className="guide-step-count">Step 2 of 6</p>
            <p className="eyebrow">Build empathy</p>
            <h2>What is the learner probably feeling?</h2>
            <p className="guide-coach">Choose the feeling that makes the situation harder. The comic should acknowledge it, not dismiss it.</p>
            <div className="choice-grid">{feelings.map((item) => <button key={item} className={feeling === item ? "choice-card active" : "choice-card"} onClick={() => setFeeling(item)}>{item}</button>)}</div>
            <div className="guide-actions"><button className="secondary-button" onClick={() => setStep("situation")}>← Situation</button><button className="primary-button" disabled={!feeling} onClick={() => setStep("victory")}>Define the victory →</button></div>
          </>}

          {mission && step === "victory" && <>
            <p className="guide-step-count">Step 3 of 6</p>
            <p className="eyebrow">Name the confidence</p>
            <h2>When this mission is over, what will the learner confidently do?</h2>
            <p className="guide-coach">Finish the idea in plain language. Avoid educational jargon.</p>
            <div className="sentence-starter"><strong>After this mission, the learner will confidently…</strong><textarea value={mission.goal} onChange={(event) => persistMission({ ...mission, goal: event.target.value })} placeholder="know whether a warning requires stopping immediately." /></div>
            <div className="guide-actions"><button className="secondary-button" onClick={() => setStep("learner")}>← Learner</button><button className="primary-button" onClick={saveVictory} disabled={!mission.goal.trim()}>Build the story →</button></div>
          </>}

          {mission && step === "story" && <>
            <p className="guide-step-count">Step 4 of 6</p>
            <p className="eyebrow">Storyboard</p>
            <h2>What happens next?</h2>
            <p className="guide-coach">Choose the purpose of the next comic moment. Then describe what the learner sees.</p>
            <div className="moment-grid">{moments.map((item) => <button key={item.id} className={moment === item.id ? "moment-card active" : "moment-card"} onClick={() => setMoment(item.id)}><strong>{item.title}</strong><small>{item.prompt}</small></button>)}</div>
            <label className="guided-scene"><span>{currentMoment.prompt}</span><textarea value={scene} onChange={(event) => setScene(event.target.value)} placeholder="Describe the scene in one or two sentences..." /></label>
            <button className="primary-button add-guided-panel" onClick={addGuidedPanel} disabled={!scene.trim()}>Create comic panel</button>
            <div className="guided-storyboard">
              {mission.elements.length === 0 ? <p>No panels yet. Your first answer will become the opening panel.</p> : mission.elements.map((element, index) => <article key={element.id}><span>{index + 1}</span><strong>{element.title}</strong><p>{element.caption || element.body}</p></article>)}
            </div>
            <div className="guide-actions"><button className="secondary-button" onClick={() => setStep("victory")}>← Victory</button><button className="primary-button" disabled={mission.elements.length === 0} onClick={() => setStep("practice")}>Add practice →</button></div>
          </>}

          {mission && step === "practice" && <>
            <p className="guide-step-count">Step 5 of 6</p>
            <p className="eyebrow">Finish in the real world</p>
            <h2>How can the learner safely practice this?</h2>
            <label>Try it yourself<textarea value={mission.realWorldAction} onChange={(event) => persistMission({ ...mission, realWorldAction: event.target.value })} placeholder="A small, safe action the learner can try today..." /></label>
            <label>You’ll know you’re ready when…<textarea value={mission.confidenceQuestion} onChange={(event) => persistMission({ ...mission, confidenceQuestion: event.target.value })} placeholder="Describe the confidence check..." /></label>
            <div className="guide-actions"><button className="secondary-button" onClick={() => setStep("story")}>← Storyboard</button><button className="primary-button" disabled={!mission.realWorldAction.trim() || !mission.confidenceQuestion.trim()} onClick={() => setStep("complete")}>Experience the mission →</button></div>
          </>}

          {mission && step === "complete" && <>
            <p className="guide-step-count">Step 6 of 6</p>
            <p className="eyebrow">Mission complete</p>
            <h2>{mission.title}</h2>
            <p className="guide-victory">After this mission, the learner will confidently {mission.goal}</p>
            <div className="guided-preview-panels">{mission.elements.map((element, index) => <article key={element.id}><span>Panel {index + 1}</span><div className="preview-art-placeholder">Artwork</div><h3>{element.title}</h3>{element.dialogue && <blockquote>{element.dialogue}</blockquote>}<p>{element.caption}</p>{element.teachingNote && <aside><strong>Learning moment</strong>{element.teachingNote}</aside>}</article>)}</div>
            <section className="guided-finish"><strong>Try it yourself</strong><p>{mission.realWorldAction}</p><strong>Confidence check</strong><p>{mission.confidenceQuestion}</p></section>
            <div className="guide-actions"><button className="secondary-button" onClick={() => setStep("story")}>← Improve storyboard</button><button className="primary-button" onClick={() => setAdvanced(true)}>Refine artwork and dialogue →</button></div>
          </>}
        </section>
      </div>
    </main>
  );
}
