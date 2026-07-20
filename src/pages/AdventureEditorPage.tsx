import { FormEvent, useState } from "react";

import Button from "../components/Button";
import Card from "../components/Card";

interface AdventureEditorPageProps {
  adventureName: string;
  onAdventureNameChange: (name: string) => void;
  onBackToWorkspace: () => void;
}

export default function AdventureEditorPage({
  adventureName,
  onAdventureNameChange,
  onBackToWorkspace,
}: AdventureEditorPageProps) {
  const [name, setName] = useState(adventureName);
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState("");
  const [outcome, setOutcome] = useState("");
  const [saved, setSaved] = useState(false);

  function saveAdventure(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    onAdventureNameChange(trimmedName);
    setSaved(true);
  }

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <header style={{ marginBottom: "32px" }}>
        <h1 style={{ marginBottom: "4px" }}>
          Adventure Learning Studio
        </h1>

        <p style={{ color: "#666", margin: 0 }}>
          Adventure Editor
        </p>
      </header>

      <Card title="Adventure">
        <form onSubmit={saveAdventure}>
          <label
            htmlFor="adventure-name"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Adventure Name
          </label>

          <input
            id="adventure-name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setSaved(false);
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px",
              marginBottom: "20px",
              fontSize: "1rem",
            }}
          />

          <label
            htmlFor="purpose"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Purpose
          </label>

          <textarea
            id="purpose"
            value={purpose}
            onChange={(event) => {
              setPurpose(event.target.value);
              setSaved(false);
            }}
            rows={4}
            placeholder="Why does this Adventure exist?"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px",
              marginBottom: "20px",
              fontSize: "1rem",
            }}
          />

          <label
            htmlFor="audience"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Target Audience
          </label>

          <textarea
            id="audience"
            value={audience}
            onChange={(event) => {
              setAudience(event.target.value);
              setSaved(false);
            }}
            rows={3}
            placeholder="Who is this Adventure for?"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px",
              marginBottom: "20px",
              fontSize: "1rem",
            }}
          />

          <label
            htmlFor="outcome"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Confidence Outcome
          </label>

          <textarea
            id="outcome"
            value={outcome}
            onChange={(event) => {
              setOutcome(event.target.value);
              setSaved(false);
            }}
            rows={3}
            placeholder="What should the learner feel confident doing?"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px",
              marginBottom: "20px",
              fontSize: "1rem",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <Button type="submit">
              Save Adventure
            </Button>

            <Button
              type="button"
              onClick={onBackToWorkspace}
            >
              Back to Workspace
            </Button>

            {saved && (
              <span style={{ color: "#2f6f3e", fontWeight: 600 }}>
                Saved
              </span>
            )}
          </div>
        </form>
      </Card>
    </main>
  );
}