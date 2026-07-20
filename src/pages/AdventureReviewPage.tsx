import ElementRenderer from "../components/ElementRenderer";
import { Adventure } from "../types";

type Props = {
  adventure: Adventure;
  onBack: () => void;
};

export default function AdventureReviewPage({
  adventure,
  onBack,
}: Props) {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#222",
      }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          marginBottom: 24,
        }}
      >
        ← Back to Editing
      </button>

      <header
        style={{
          marginBottom: 40,
          paddingBottom: 24,
          borderBottom: "2px solid #ddd",
        }}
      >
        <h1
          style={{
            marginBottom: 16,
            fontSize: 38,
          }}
        >
          {adventure.name}
        </h1>

        {adventure.purpose && (
          <section>
            <h2>Purpose</h2>
            <p style={{ lineHeight: 1.6 }}>
              {adventure.purpose}
            </p>
          </section>
        )}

        {adventure.audience && (
          <section>
            <h2>Audience</h2>
            <p style={{ lineHeight: 1.6 }}>
              {adventure.audience}
            </p>
          </section>
        )}

        {adventure.confidenceOutcome && (
          <section>
            <h2>Confidence Outcome</h2>
            <p style={{ lineHeight: 1.6 }}>
              {adventure.confidenceOutcome}
            </p>
          </section>
        )}
      </header>

      {adventure.missions.length === 0 ? (
        <p>This Adventure does not contain any missions yet.</p>
      ) : (
        adventure.missions.map((mission) => (
          <article
            key={mission.number}
            style={{
              marginBottom: 56,
            }}
          >
            <header
              style={{
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "#666",
                }}
              >
                {mission.number}
              </div>

              <h2
                style={{
                  marginTop: 6,
                  marginBottom: 16,
                  fontSize: 30,
                }}
              >
                {mission.title}
              </h2>

              {mission.goal && (
                <div
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    background: "#f3f3f3",
                  }}
                >
                  <strong>Goal</strong>

                  <p
                    style={{
                      marginBottom: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {mission.goal}
                  </p>
                </div>
              )}
            </header>

            {mission.elements.length === 0 ? (
              <p
                style={{
                  color: "#666",
                  fontStyle: "italic",
                }}
              >
                This mission does not contain any elements yet.
              </p>
            ) : (
              mission.elements.map((element) => (
                <ElementRenderer
                  key={element.id}
                  element={element}
                />
              ))
            )}

            {mission.realWorldAction && (
              <section
                style={{
                  marginTop: 28,
                  padding: 18,
                  border: "2px solid #4c9b8f",
                  borderRadius: 8,
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  ✅ Real-World Action
                </h3>

                <p
                  style={{
                    marginBottom: 0,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {mission.realWorldAction}
                </p>
              </section>
            )}

            {mission.confidenceQuestion && (
              <section
                style={{
                  marginTop: 20,
                  padding: 18,
                  border: "2px solid #7474c9",
                  borderRadius: 8,
                  background: "#f4f4ff",
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  🎯 Confidence Check
                </h3>

                <p
                  style={{
                    marginBottom: 0,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {mission.confidenceQuestion}
                </p>
              </section>
            )}
          </article>
        ))
      )}
    </main>
  );
}