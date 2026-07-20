import {
  ComicPanel,
  MissionElement,
  TextElement,
  TextElementType,
} from "../types";

type Props = {
  element: MissionElement;
  onChange: (element: MissionElement) => void;
  onDelete: () => void;
};

const elementTypes: MissionElement["type"][] = [
  "Story",
  "Comic Panel",
  "Instruction",
  "Warning",
  "Tip",
  "Question",
  "Action",
  "Reflection",
  "Confidence Check",
];

function createElementForType(
  currentElement: MissionElement,
  newType: MissionElement["type"],
): MissionElement {
  if (newType === "Comic Panel") {
    return {
      id: currentElement.id,
      type: "Comic Panel",
      title: currentElement.title,
      image: "",
      caption:
        currentElement.type === "Comic Panel"
          ? currentElement.caption
          : currentElement.body,
      altText: "",
      notes: "",
    };
  }

  const body =
    currentElement.type === "Comic Panel"
      ? currentElement.caption
      : currentElement.body;

  return {
    id: currentElement.id,
    type: newType as TextElementType,
    title: currentElement.title,
    body,
  };
}

export default function MissionElementEditor({
  element,
  onChange,
  onDelete,
}: Props) {
  function changeType(
    newType: MissionElement["type"],
  ) {
    onChange(
      createElementForType(element, newType),
    );
  }

  function updateTextElement(
    field: keyof TextElement,
    value: string,
  ) {
    if (element.type === "Comic Panel") {
      return;
    }

    onChange({
      ...element,
      [field]: value,
    });
  }

  function updateComicPanel(
    field: keyof ComicPanel,
    value: string,
  ) {
    if (element.type !== "Comic Panel") {
      return;
    }

    onChange({
      ...element,
      [field]: value,
    });
  }

  return (
    <section
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <strong>Mission Element</strong>

        <button
          type="button"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>

      <label
        style={{
          display: "block",
          marginBottom: 16,
        }}
      >
        <strong>Type</strong>

        <select
          value={element.type}
          onChange={(event) =>
            changeType(
              event.target
                .value as MissionElement["type"],
            )
          }
          style={{
            display: "block",
            width: "100%",
            marginTop: 6,
            padding: 8,
          }}
        >
          {elementTypes.map((type) => (
            <option
              key={type}
              value={type}
            >
              {type}
            </option>
          ))}
        </select>
      </label>

      <label
        style={{
          display: "block",
          marginBottom: 16,
        }}
      >
        <strong>Title</strong>

        <input
          type="text"
          value={element.title}
          onChange={(event) => {
            if (element.type === "Comic Panel") {
              updateComicPanel(
                "title",
                event.target.value,
              );
            } else {
              updateTextElement(
                "title",
                event.target.value,
              );
            }
          }}
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            marginTop: 6,
            padding: 8,
          }}
        />
      </label>

      {element.type === "Comic Panel" ? (
        <>
          <label
            style={{
              display: "block",
              marginBottom: 16,
            }}
          >
            <strong>Image URL or Path</strong>

            <input
              type="text"
              value={element.image}
              placeholder="/images/panel-01.png"
              onChange={(event) =>
                updateComicPanel(
                  "image",
                  event.target.value,
                )
              }
              style={{
                display: "block",
                width: "100%",
                boxSizing: "border-box",
                marginTop: 6,
                padding: 8,
              }}
            />
          </label>

          {element.image && (
            <div
              style={{
                marginBottom: 16,
              }}
            >
              <strong>Image Preview</strong>

              <img
                src={element.image}
                alt={
                  element.altText ||
                  element.title ||
                  "Comic panel preview"
                }
                style={{
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: 400,
                  marginTop: 8,
                  border: "1px solid #ddd",
                  borderRadius: 6,
                }}
              />
            </div>
          )}

          <label
            style={{
              display: "block",
              marginBottom: 16,
            }}
          >
            <strong>Caption</strong>

            <textarea
              rows={3}
              value={element.caption}
              onChange={(event) =>
                updateComicPanel(
                  "caption",
                  event.target.value,
                )
              }
              style={{
                display: "block",
                width: "100%",
                boxSizing: "border-box",
                marginTop: 6,
                padding: 8,
              }}
            />
          </label>

          <label
            style={{
              display: "block",
              marginBottom: 16,
            }}
          >
            <strong>Alt Text</strong>

            <textarea
              rows={2}
              value={element.altText}
              onChange={(event) =>
                updateComicPanel(
                  "altText",
                  event.target.value,
                )
              }
              style={{
                display: "block",
                width: "100%",
                boxSizing: "border-box",
                marginTop: 6,
                padding: 8,
              }}
            />
          </label>

          <label
            style={{
              display: "block",
            }}
          >
            <strong>Author Notes</strong>

            <textarea
              rows={3}
              value={element.notes}
              onChange={(event) =>
                updateComicPanel(
                  "notes",
                  event.target.value,
                )
              }
              style={{
                display: "block",
                width: "100%",
                boxSizing: "border-box",
                marginTop: 6,
                padding: 8,
              }}
            />
          </label>
        </>
      ) : (
        <label
          style={{
            display: "block",
          }}
        >
          <strong>Body</strong>

          <textarea
            rows={5}
            value={element.body}
            onChange={(event) =>
              updateTextElement(
                "body",
                event.target.value,
              )
            }
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              marginTop: 6,
              padding: 8,
            }}
          />
        </label>
      )}
    </section>
  );
}