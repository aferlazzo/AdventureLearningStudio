import { FormEvent, useState } from "react";

import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";

export default function WorkspacePage() {
  const [showNewAdventure, setShowNewAdventure] = useState(false);
  const [adventureName, setAdventureName] = useState("");
  const [currentAdventure, setCurrentAdventure] = useState(
    "Driver Confidence Guide",
  );

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

    setCurrentAdventure(trimmedName);
    closeNewAdventureModal();
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
            Version 0.1.2
          </p>
        </header>

        <h2 style={{ marginBottom: "24px" }}>
          Workspace
        </h2>

        <Card title="Current Adventure">
          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "16px",
            }}
          >
            <strong>{currentAdventure}</strong>
          </p>

          <Button>
            Continue Editing
          </Button>
        </Card>

        <Card title="Recent Adventures">
          <ul style={{ lineHeight: "2" }}>
            <li>{currentAdventure}</li>
            <li>AI for Seniors</li>
            <li>Gardening Basics</li>
          </ul>

          <Button onClick={() => setShowNewAdventure(true)}>
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
            onChange={(event) => setAdventureName(event.target.value)}
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
            <Button onClick={closeNewAdventureModal}>
              Cancel
            </Button>

            <Button type="submit">
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}