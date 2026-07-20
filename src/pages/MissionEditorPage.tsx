import MissionElementEditor from "../components/MissionElementEditor";

import {
  Mission,
  MissionElement,
} from "../types";

type Props = {
  adventureName: string;
  mission: Mission;
  onMissionChange: (
    mission: Mission,
  ) => void;
  onBack: () => void;
};

export default function MissionEditorPage({
  adventureName,
  mission,
  onMissionChange,
  onBack,
}: Props) {
  function updateField<
    K extends keyof Mission,
  >(
    field: K,
    value: Mission[K],
  ) {
    onMissionChange({
      ...mission,
      [field]: value,
    });
  }

  function updateElement(
    index: number,
    updatedElement: MissionElement,
  ) {
    const elements = [...mission.elements];

    elements[index] = updatedElement;

    updateField("elements", elements);
  }

  function deleteElement(index: number) {
    const elements = mission.elements.filter(
      (_, i) => i !== index,
    );

    updateField("elements", elements);
  }

  function addElement() {
    const newElement: MissionElement = {
      id: Date.now(),

      type: "Instruction",

      title: "",

      body: "",
    };

    updateField("elements", [
      ...mission.elements,
      newElement,
    ]);
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <button
        type="button"
        onClick={onBack}
      >
        ← Back
      </button>

      <p
        style={{
          color: "#666",
        }}
      >
        {adventureName}
      </p>

      <h1>{mission.number}</h1>

      <label
        style={{
          display: "block",
          marginBottom: 20,
        }}
      >
        <strong>Title</strong>

        <input
          type="text"
          value={mission.title}
          onChange={(event) =>
            updateField(
              "title",
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
          marginBottom: 20,
        }}
      >
        <strong>Goal</strong>

        <textarea
          rows={3}
          value={mission.goal}
          onChange={(event) =>
            updateField(
              "goal",
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

      <h2>Mission Elements</h2>

      {mission.elements.map(
        (element, index) => (
          <MissionElementEditor
            key={element.id}
            element={element}
            onChange={(updated) =>
              updateElement(
                index,
                updated,
              )
            }
            onDelete={() =>
              deleteElement(index)
            }
          />
        ),
      )}

      <button
        type="button"
        onClick={addElement}
        style={{
          marginTop: 12,
          marginBottom: 30,
        }}
      >
        + Add Mission Element
      </button>

      <label
        style={{
          display: "block",
          marginBottom: 20,
        }}
      >
        <strong>Real-World Action</strong>

        <textarea
          rows={4}
          value={mission.realWorldAction}
          onChange={(event) =>
            updateField(
              "realWorldAction",
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
          marginBottom: 20,
        }}
      >
        <strong>Confidence Check</strong>

        <textarea
          rows={3}
          value={mission.confidenceQuestion}
          onChange={(event) =>
            updateField(
              "confidenceQuestion",
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
    </div>
  );
}