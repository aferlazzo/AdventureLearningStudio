import { useState } from "react";

import AdventureWorkspacePage from "./pages/AdventureWorkspacePage";
import MissionEditorPage from "./pages/MissionEditorPage";
import WorkspacePage from "./pages/WorkspacePage";
import AdventureReviewPage from "./pages/AdventureReviewPage";

import { Adventure, Mission } from "./types";

type Screen =
  | "workspace"
  | "adventure"
  | "mission"
  | "review";

const initialMissions: Mission[] = [
  {
    number: "Mission 00",
    title: "Understanding the Basics",
    goal: "",
    realWorldAction: "",
    confidenceQuestion:
      "How confident are you that you could do this today?",
    elements: [],
  },
  {
    number: "Mission 01",
    title: "Fueling the Vehicle",
    goal: "",
    realWorldAction: "",
    confidenceQuestion:
      "How confident are you that you could do this today?",
    elements: [],
  },
  {
    number: "Mission 02",
    title: "Find the Owner's Manual",
    goal: "",
    realWorldAction: "",
    confidenceQuestion:
      "How confident are you that you could do this today?",
    elements: [],
  },
  {
    number: "Mission 03",
    title: "Dashboard Warning Lights",
    goal: "",
    realWorldAction: "",
    confidenceQuestion:
      "How confident are you that you could do this today?",
    elements: [],
  },
];

const initialAdventure: Adventure = {
  id: "dcg",
  name: "Driver Confidence Guide",
  purpose: "",
  audience: "",
  confidenceOutcome: "",
  missions: initialMissions,
};

export default function App() {
  const [screen, setScreen] =
    useState<Screen>("workspace");

  const [adventure, setAdventure] =
    useState<Adventure>(initialAdventure);

  const [selectedMissionNumber, setSelectedMissionNumber] =
    useState<string | null>(null);

  const selectedMission =
    adventure.missions.find(
      (mission) =>
        mission.number === selectedMissionNumber,
    ) ?? null;

  function openMission(missionNumber: string) {
    setSelectedMissionNumber(missionNumber);
    setScreen("mission");
  }

  function updateMission(updatedMission: Mission) {
    setAdventure((currentAdventure) => ({
      ...currentAdventure,
      missions: currentAdventure.missions.map((mission) =>
        mission.number === updatedMission.number
          ? updatedMission
          : mission,
      ),
    }));
  }

  function updateAdventureName(name: string) {
    setAdventure((currentAdventure) => ({
      ...currentAdventure,
      name,
    }));
  }

  function getNextMissionNumber(
    missions: Mission[],
  ): string {
    const existingNumbers = missions
      .map((mission) => {
        const match =
          mission.number.match(/Mission\s+(\d+)/);

        return match ? Number(match[1]) : -1;
      })
      .filter((number) => number >= 0);

    const nextNumber =
      existingNumbers.length === 0
        ? 0
        : Math.max(...existingNumbers) + 1;

    return `Mission ${String(nextNumber).padStart(
      2,
      "0",
    )}`;
  }

  function createMission() {
    const newMission: Mission = {
      number: getNextMissionNumber(
        adventure.missions,
      ),
      title: "Untitled Mission",
      goal: "",
      realWorldAction: "",
      confidenceQuestion:
        "How confident are you that you could do this today?",
      elements: [],
    };

    setAdventure((currentAdventure) => ({
      ...currentAdventure,
      missions: [
        ...currentAdventure.missions,
        newMission,
      ],
    }));

    setSelectedMissionNumber(newMission.number);
    setScreen("mission");
  }

  function duplicateMission(
    missionNumber: string,
  ) {
    const sourceMission =
      adventure.missions.find(
        (mission) =>
          mission.number === missionNumber,
      );

    if (!sourceMission) {
      return;
    }

    const duplicatedMission: Mission = {
      ...sourceMission,
      number: getNextMissionNumber(
        adventure.missions,
      ),
      title: `${sourceMission.title} Copy`,
      elements: sourceMission.elements.map(
        (element, index) => ({
          ...element,
          id: Date.now() + index,
        }),
      ),
    };

    setAdventure((currentAdventure) => ({
      ...currentAdventure,
      missions: [
        ...currentAdventure.missions,
        duplicatedMission,
      ],
    }));

    setSelectedMissionNumber(
      duplicatedMission.number,
    );
    setScreen("mission");
  }

  function deleteMission(
    missionNumber: string,
  ) {
    const mission =
      adventure.missions.find(
        (item) =>
          item.number === missionNumber,
      );

    if (!mission) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${mission.number}: ${mission.title}?`,
    );

    if (!confirmed) {
      return;
    }

    setAdventure((currentAdventure) => ({
      ...currentAdventure,
      missions: currentAdventure.missions.filter(
        (item) =>
          item.number !== missionNumber,
      ),
    }));

    if (
      selectedMissionNumber === missionNumber
    ) {
      setSelectedMissionNumber(null);
    }
  }

  function moveMission(
    missionNumber: string,
    direction: "up" | "down",
  ) {
    setAdventure((currentAdventure) => {
      const missions = [
        ...currentAdventure.missions,
      ];

      const currentIndex =
        missions.findIndex(
          (mission) =>
            mission.number === missionNumber,
        );

      if (currentIndex === -1) {
        return currentAdventure;
      }

      const targetIndex =
        direction === "up"
          ? currentIndex - 1
          : currentIndex + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= missions.length
      ) {
        return currentAdventure;
      }

      [missions[currentIndex], missions[targetIndex]] =
        [
          missions[targetIndex],
          missions[currentIndex],
        ];

      return {
        ...currentAdventure,
        missions,
      };
    });
  }

  if (screen === "mission" && selectedMission) {
    return (
      <MissionEditorPage
        adventureName={adventure.name}
        mission={selectedMission}
        onMissionChange={updateMission}
        onBack={() => setScreen("adventure")}
      />
    );
  }

  if (screen === "review") {
    return (
      <AdventureReviewPage
        adventure={adventure}
        onBack={() => setScreen("adventure")}
      />
    );
  }

  if (screen === "adventure") {
    return (
      <AdventureWorkspacePage
        adventure={adventure}
        onAdventureChange={setAdventure}
        onOpenMission={openMission}
        onNewMission={createMission}
        onDuplicateMission={duplicateMission}
        onDeleteMission={deleteMission}
        onMoveMission={moveMission}
        onReview={() => setScreen("review")}
        onBack={() => setScreen("workspace")}
      />
    );
  }

  return (
    <WorkspacePage
      currentAdventure={adventure.name}
      onCurrentAdventureChange={
        updateAdventureName
      }
      onContinueEditing={() =>
        setScreen("adventure")
      }
    />
  );
}