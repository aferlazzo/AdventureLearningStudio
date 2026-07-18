import type { Adventure, AdventureSectionKey } from "../models/adventure";

const labels: Record<AdventureSectionKey, string> = {
  situation: "Situation",
  anxiety: "Anxiety",
  decision: "Decision",
  experience: "Experience",
  consequences: "Consequences",
  capability: "Capability"
};

interface ContinuePanelProps {
  adventure: Adventure;
  onContinue: (section: AdventureSectionKey) => void;
}

export function ContinuePanel({ adventure, onContinue }: ContinuePanelProps) {
  const keys = Object.keys(labels) as AdventureSectionKey[];
  const next = keys.find((key) => !adventure.sections[key].complete);
  const completed = keys.filter((key) => adventure.sections[key].complete).length;

  if (!next) {
    return (
      <section className="panel continue-panel">
        <p className="eyebrow">Adventure complete</p>
        <h2>Ready for review</h2>
        <p>All six core sections are complete. Preview and publishing will be added in later sprints.</p>
      </section>
    );
  }

  return (
    <section className="panel continue-panel">
      <p className="eyebrow">Continue building</p>
      <h2>Your next step is {labels[next]}</h2>
      <p className="lead">
        {next === "experience"
          ? "Capture what actually happened and the expert reasoning behind it."
          : `Complete the ${labels[next]} section of this Adventure.`}
      </p>

      <div className="completion-summary">
        <strong>{completed} of {keys.length} sections complete</strong>
        <span>Estimated time: 5–8 minutes</span>
      </div>

      <button className="primary-button large-button" onClick={() => onContinue(next)}>
        Continue
      </button>
    </section>
  );
}
