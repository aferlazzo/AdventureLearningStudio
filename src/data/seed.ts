import type { Adventure } from "../models/adventure";

export const seedAdventures: Adventure[] = [
  {
    id: crypto.randomUUID(),
    title: "Driver Confidence Guide",
    summary:
      "Build confidence with the practical responsibilities of driving and owning a car.",
    author: "Anthony Ferlazzo",
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    status: "draft",
    version: 1,
    tags: ["driving", "car ownership", "confidence"],
    domain: "Driver Confidence Guide",
    sections: {
      situation: {
        complete: true,
        content:
          "Many new and less-confident drivers were never taught the practical basics of using and owning a car.",
      },
      anxiety: {
        complete: true,
        content:
          "Unfamiliar warning lights, maintenance responsibilities, and roadside problems can make driving stressful.",
      },
      decision: {
        complete: true,
        content:
          "Learn the essential tasks and decisions that help a driver respond calmly and safely.",
      },
      experience: {
        complete: false,
        content: "",
      },
      consequences: {
        complete: false,
        content: "",
      },
      capability: {
        complete: false,
        content: "",
      },
    },
    notes: [],
    activity: [
      "Driver Confidence Guide created",
      "Initial Adventure information added",
    ],
  },
];