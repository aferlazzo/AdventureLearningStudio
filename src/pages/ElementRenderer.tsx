import {
  MissionElement,
  TextElement,
} from "../types";

type Props = {
  element: MissionElement;
};

type ElementStyle = {
  label: string;
  icon: string;
  background: string;
  border: string;
};

function getElementStyle(
  type: TextElement["type"],
): ElementStyle {
  switch (type) {
    case "Instruction":
      return {
        label: "Instruction",
        icon: "📘",
        background: "#f4f8ff",
        border: "#7aa7e8",
      };

    case "Warning":
      return {
        label: "Warning",
        icon: "⚠️",
        background: "#fff7e6",
        border: "#e6a23c",
      };

    case "Tip":
      return {
        label: "Tip",
        icon: "💡",
        background: "#f3fbf4",
        border: "#6aaa75",
      };

    case "Question":
      return {
        label: "Question",
        icon: "❓",
        background: "#f8f4ff",
        border: "#9a7ac7",
      };

    case "Action":
      return {
        label: "Action",
        icon: "✅",
        background: "#eefaf8",
        border: "#4c9b8f",
      };

    case "Reflection":
      return {
        label: "Reflection",
        icon: "💭",
        background: "#faf7f2",
        border: "#a58b67",
      };

    case "Confidence Check":
      return {
        label: "Confidence Check",
        icon: "🎯",
        background: "#f4f4ff",
        border: "#7474c9",
      };

    case "Story":
      return {
        label: "Story",
        icon: "📖",
        background: "#fffaf2",
        border: "#c39451",
      };
  }
}

function ComicPanelRenderer({
  element,
}: {
  element: Extract<
    MissionElement,
    { type: "Comic Panel" }
  >;
}) {
  return (
    <figure
      style={{
        margin: "24px 0",
        padding: 16,
        border: "1px solid #aaa",
        borderRadius: 8,
        background: "#f8f8f8",
      }}
    >
      <div
        style={{
          marginBottom: 12,
          fontWeight: 700,
        }}
      >
        🖼️ Comic Panel
      </div>

      {element.title && (
        <h3
          style={{
            marginTop: 0,
          }}
        >
          {element.title}
        </h3>
      )}

      {element.image ? (
        <img
          src={element.image}
          alt={
            element.altText ||
            element.title ||
            "Comic panel"
          }
          style={{
            display: "block",
            width: "100%",
            maxHeight: 650,
            objectFit: "contain",
            borderRadius: 6,
            background: "#fff",
          }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            minHeight: 220,
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #aaa",
            borderRadius: 6,
            background: "#fff",
            color: "#666",
          }}
        >
          No image selected
        </div>
      )}

      {element.caption && (
        <figcaption
          style={{
            marginTop: 12,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {element.caption}
        </figcaption>
      )}
    </figure>
  );
}

function TextElementRenderer({
  element,
}: {
  element: TextElement;
}) {
  const style = getElementStyle(element.type);

  return (
    <section
      style={{
        marginTop: 20,
        padding: 18,
        border: `1px solid ${style.border}`,
        borderLeft: `6px solid ${style.border}`,
        borderRadius: 8,
        background: style.background,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom:
            element.title || element.body ? 10 : 0,
          fontWeight: 700,
        }}
      >
        <span aria-hidden="true">
          {style.icon}
        </span>

        <span>{style.label}</span>
      </div>

      {element.title && (
        <h3
          style={{
            marginTop: 0,
            marginBottom: 8,
          }}
        >
          {element.title}
        </h3>
      )}

      {element.body && (
        <p
          style={{
            margin: 0,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {element.body}
        </p>
      )}
    </section>
  );
}

export default function ElementRenderer({
  element,
}: Props) {
  if (element.type === "Comic Panel") {
    return (
      <ComicPanelRenderer element={element} />
    );
  }

  return (
    <TextElementRenderer element={element} />
  );
}