import { FormEvent, useState } from "react";

import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";

interface WorkspacePageProps {
  currentAdventure: string;
  onCurrentAdventureChange: (name: string) => void;
  onContinueEditing: () => void;
}

export default function WorkspacePage({
  currentAdventure,
  onCurrentAdventureChange,
  onContinueEditing,
}: WorkspacePageProps) {
  const [showNewAdventure, setShowNewAdventure] = useState(false);
  const [adventureName, setAdventureName] = useState("");

  const hasCurrentAdventure = currentAdventure.trim().length > 0;

  function openNewAdventureModal() {
    setAdventureName("");
    setShowNewAdventure(true);
  }

  function closeNewAdventureModal() {
    setShowNewAdventure(false);
    setAdventureName("");
  }

  function createAdventure(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = adventureName.trim();

    if (!trimmedName) {
      return;
    }

    onCurrentAdventureChange(trimmedName);
    closeNewAdventureModal();

    // Move directly into the authoring screen.
    onContinueEditing();
  }

  return (
    <>
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
            Version 0.1.3
          </p>
        </header>

        <h2 style={{ marginBottom: "24px" }}>
          Workspace
        </h2>

        {hasCurrentAdventure ? (
          <Card title="Current Adventure">
            <p
              style={{
                fontSize: "1.1rem",
                marginBottom: "16px",
              }}
            >
              <strong>{currentAdventure}</strong>
            </p>

            <Button onClick={onContinueEditing}>
              Continue Editing
            </Button>
          </Card>
        ) : (
          <Card title="Current Adventure">
            <p style={{ color: "#666", marginBottom: "16px" }}>
              No adventure has been created yet.
            </p>

            <Button onClick={openNewAdventureModal}>
              Create Your First Adventure
            </Button>
          </Card>
        )}

        <Card title="Adventures">
          {hasCurrentAdventure ? (
            <ul
              style={{
                lineHeight: "2",
                marginBottom: "20px",
              }}
            >
              <li>{currentAdventure}</li>
            </ul>
          ) : (
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Your adventures will appear here.
            </p>
          )}

          <Button onClick={openNewAdventureModal}>
            New Adventure
          </Button>
        </Card>
      </main>

      <Modal
        title="New Adventure"
        open={showNewAdventure}
        onClose={closeNewAdventureModal}
      >
        <form onSubmit={createAdventure}>
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
            value={adventureName}
            onChange={(event) =>
              setAdventureName(event.target.value)
            }
            placeholder="Example: Driver Confidence Guide"
            autoFocus
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px",
              fontSize: "1rem",
              border: "1px solid #999",
              borderRadius: "4px",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "24px",
            }}
          >
            <Button
              type="button"
              onClick={closeNewAdventureModal}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!adventureName.trim()}
            >
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}