import { useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { LibraryPage } from "./pages/LibraryPage";
import { GuidedWorkspacePage } from "./pages/GuidedWorkspacePage";
import { loadAdventures, saveAdventures } from "./services/adventureStore";
import type { Adventure } from "./models/adventure";

export default function App() {
  const [adventures, setAdventures] = useState<Adventure[]>(() => loadAdventures());
  const [activeAdventureId, setActiveAdventureId] = useState<string | null>(null);

  const activeAdventure = adventures.find(
    (adventure) => adventure.id === activeAdventureId
  );

  function persist(next: Adventure[]) {
    setAdventures(next);
    saveAdventures(next);
  }

  function updateAdventure(updated: Adventure) {
    persist(
      adventures.map((item) => (item.id === updated.id ? updated : item))
    );
  }

  function createAdventure() {
    const now = new Date().toISOString();

    const adventure: Adventure = {
      id: crypto.randomUUID(),
      title: "Untitled Adventure",
      summary: "A new Adventure ready to be developed.",
      author: "Anthony Ferlazzo",
      created: now,
      updated: now,
      status: "draft",
      version: 1,
      tags: [],
      domain: "General",

      purpose: "",
      audience: "",
      confidenceOutcome: "",

      missions: [],

      notes: [],
      activity: ["Adventure created"]
    };

    persist([adventure, ...adventures]);
    setActiveAdventureId(adventure.id);
  }

  function deleteAdventure(id: string) {
    const adventure = adventures.find((item) => item.id === id);
    if (!adventure) return;

    const confirmed = window.confirm(
      `Delete "${adventure.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    persist(adventures.filter((item) => item.id !== id));
    setActiveAdventureId(null);
  }

  return (
    <>
      <AppHeader onHome={() => setActiveAdventureId(null)} />

      {activeAdventure ? (
        <GuidedWorkspacePage
          adventure={activeAdventure}
          onBack={() => setActiveAdventureId(null)}
          onDelete={deleteAdventure}
          onUpdate={updateAdventure}
        />
      ) : (
        <LibraryPage
          adventures={adventures}
          onOpen={setActiveAdventureId}
          onCreate={createAdventure}
        />
      )}
    </>
  );
}
