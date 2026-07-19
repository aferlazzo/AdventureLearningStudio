import { useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { LibraryPage } from "./pages/LibraryPage";
import { WorkspacePage } from "./pages/WorkspacePage";
import { loadAdventures, saveAdventures } from "./services/adventureStore";
import type { Adventure } from "./models/adventure";

export default function App() {
  const [adventures, setAdventures] = useState<Adventure[]>(() => loadAdventures());
  const [activeAdventureId, setActiveAdventureId] = useState<string | null>(null);

  const activeAdventure = adventures.find((adventure) => adventure.id === activeAdventureId);

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
      sections: {
        situation: { complete: false, content: "" },
        anxiety: { complete: false, content: "" },
        decision: { complete: false, content: "" },
        experience: { complete: false, content: "" },
        consequences: { complete: false, content: "" },
        capability: { complete: false, content: "" }
      },
      notes: [],
      activity: ["Adventure created"]
    };

    const next = [adventure, ...adventures];
    setAdventures(next);
    saveAdventures(next);
    setActiveAdventureId(adventure.id);
  }

  function deleteAdventure(id: string) {
    const adventure = adventures.find((item) => item.id === id);
    if (!adventure) return;

    const confirmed = window.confirm(`Delete "${adventure.title}"? This cannot be undone.`);
    if (!confirmed) return;

    const next = adventures.filter((item) => item.id !== id);
    setAdventures(next);
    saveAdventures(next);
    setActiveAdventureId(null);
  }

  return (
    <>
      <AppHeader onHome={() => setActiveAdventureId(null)} />
      {activeAdventure ? (
        <WorkspacePage
          adventure={activeAdventure}
          onBack={() => setActiveAdventureId(null)}
          onDelete={deleteAdventure}
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
