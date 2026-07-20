import type { Adventure, AdventureSectionKey } from "../models/adventure";

const sectionLabels: Record<AdventureSectionKey, string> = {
  situation: "Situation",
  anxiety: "Anxiety",
  decision: "Decision",
  experience: "Experience",
  consequences: "Consequences",
  capability: "Capability"
};

export function ProgressPanel({ adventure }: { adventure: Adventure }) {
  const keys = Object.keys(sectionLabels) as AdventureSectionKey[];
  const completed = keys.filter((key) => adventure.sections[key].complete).length;
  const next = keys.find((key) => !adventure.sections[key].complete);

  return (
    <aside className="panel progress-panel">
      <h2>Progress</h2>
      <div className="progress-list">
        {keys.map((key) => {
          const section = adventure.sections[key];
          const isNext = key === next;
          return (
            <div key={key} className={section.complete ? "progress-item complete" : isNext ? "progress-item next" : "progress-item"}>
              <span>{section.complete ? "✓" : isNext ? "▶" : "○"}</span>
              <span>{sectionLabels[key]}{isNext ? " (Next)" : ""}</span>
            </div>
          );
        })}
      </div>

      <hr />
      <h3>Adventure Health</h3>
      <p>{Math.round((completed / keys.length) * 100)}% complete</p>
      <p>No validation errors</p>
    </aside>
  );
}
