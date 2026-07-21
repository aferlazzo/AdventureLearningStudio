import type { MissionElement } from "../models/adventure";

interface ElementRendererProps {
  element: MissionElement;
}

const elementStyles: Record<
  MissionElement["type"],
  {
    label: string;
    className: string;
  }
> = {
  Story: {
    label: "Story",
    className: "mission-element story-element",
  },
  Instruction: {
    label: "Instruction",
    className: "mission-element instruction-element",
  },
  "Comic Panel": {
    label: "Comic Panel",
    className: "mission-element comic-panel-element",
  },
  Warning: {
    label: "Warning",
    className: "mission-element warning-element",
  },
  Tip: {
    label: "Tip",
    className: "mission-element tip-element",
  },
  Question: {
    label: "Question",
    className: "mission-element question-element",
  },
};

export default function ElementRenderer({
  element,
}: ElementRendererProps) {
  const style = elementStyles[element.type];

  return (
    <section
      className={style.className}
      style={{
        marginBottom: 20,
        padding: 18,
        border: "1px solid #d7d9dc",
        borderRadius: 10,
        background: "#ffffff",
      }}
    >
      <div
        style={{
          marginBottom: 8,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          color: "#666",
        }}
      >
        {style.label}
      </div>

      {element.title && (
        <h3
          style={{
            marginTop: 0,
            marginBottom: 10,
          }}
        >
          {element.title}
        </h3>
      )}

      {element.body ? (
        <p
          style={{
            margin: 0,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {element.body}
        </p>
      ) : (
        <p
          style={{
            margin: 0,
            color: "#777",
            fontStyle: "italic",
          }}
        >
          No content has been added yet.
        </p>
      )}
    </section>
  );
}