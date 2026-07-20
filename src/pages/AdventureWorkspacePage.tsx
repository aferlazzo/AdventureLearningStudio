import { Adventure } from "../types";

type Props = {
  adventure: Adventure;
  onAdventureChange: (
    adventure: Adventure,
  ) => void;
  onOpenMission: (
    missionNumber: string,
  ) => void;
  onNewMission: () => void;
  onDuplicateMission: (
    missionNumber: string,
  ) => void;
  onDeleteMission: (
    missionNumber: string,
  ) => void;
  onMoveMission: (
    missionNumber: string,
    direction: "up" | "down",
  ) => void;
  onBack: () => void;
};

export default function AdventureWorkspacePage({
  adventure,
  onAdventureChange,
  onOpenMission,
  onNewMission,
  onDuplicateMission,
  onDeleteMission,
  onMoveMission,
  onBack,
}: Props) {
  function updateAdventureField<
    K extends keyof Adventure,
  >(
    field: K,
    value: Adventure[K],
  ) {
    onAdventureChange({
      ...adventure,
      [field]: value,
    });
  }

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <button
        type="button"
        onClick={onBack}
      >
        ← Back
      </button>

      <h1>Adventure</h1>

      <h3>Name</h3>

      <input
        style={{
          width: "100%",
          boxSizing: "border-box",
          fontSize: 24,
          padding: 8,
        }}
        value={adventure.name}
        onChange={(event) =>
          updateAdventureField(
            "name",
            event.target.value,
          )
        }
      />

      <h3>Purpose</h3>

      <textarea
        rows={3}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: 8,
        }}
        value={adventure.purpose}
        onChange={(event) =>
          updateAdventureField(
            "purpose",
            event.target.value,
          )
        }
      />

      <h3>Audience</h3>

      <textarea
        rows={3}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: 8,
        }}
        value={adventure.audience}
        onChange={(event) =>
          updateAdventureField(
            "audience",
            event.target.value,
          )
        }
      />

      <h3>Confidence Outcome</h3>

      <textarea
        rows={3}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: 8,
        }}
        value={adventure.confidenceOutcome}
        onChange={(event) =>
          updateAdventureField(
            "confidenceOutcome",
            event.target.value,
          )
        }
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 32,
        }}
      >
        <h2>Missions</h2>

        <button
          type="button"
          onClick={onNewMission}
          style={{
            padding: "10px 18px",
          }}
        >
          + New Mission
        </button>
      </div>

      {adventure.missions.length === 0 ? (
        <p>No missions yet.</p>
      ) : (
        adventure.missions.map(
          (mission, index) => (
            <div
              key={mission.number}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <strong>
                {mission.number}
              </strong>

              <h3
                style={{
                  marginTop: 6,
                  marginBottom: 10,
                }}
              >
                {mission.title}
              </h3>

              {mission.goal && (
                <p>
                  <strong>Goal:</strong>{" "}
                  {mission.goal}
                </p>
              )}

              <p>
                {mission.elements.length}{" "}
                {mission.elements.length === 1
                  ? "Mission Element"
                  : "Mission Elements"}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    onOpenMission(
                      mission.number,
                    )
                  }
                >
                  Open
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDuplicateMission(
                      mission.number,
                    )
                  }
                >
                  Duplicate
                </button>

                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() =>
                    onMoveMission(
                      mission.number,
                      "up",
                    )
                  }
                >
                  ↑ Move Up
                </button>

                <button
                  type="button"
                  disabled={
                    index ===
                    adventure.missions.length - 1
                  }
                  onClick={() =>
                    onMoveMission(
                      mission.number,
                      "down",
                    )
                  }
                >
                  ↓ Move Down
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDeleteMission(
                      mission.number,
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ),
        )
      )}
    </div>
  );
}