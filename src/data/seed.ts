import type { Adventure } from "../models/adventure";

export const seedAdventures: Adventure[] = [
  {
    id: crypto.randomUUID(),
    title: "Garbage in the Road",
    summary: "Respond calmly and safely when debris blocks the road.",
    author: "Anthony Ferlazzo",
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    status: "draft",
    version: 1,
    tags: ["safety", "hazards"],
    domain: "Driver Confidence Guide",
    sections: {
      situation: { complete: true, content: "Debris appears unexpectedly in the roadway." },
      anxiety: { complete: true, content: "The learner may panic, swerve, or freeze." },
      decision: { complete: true, content: "Choose whether to slow, stop, steer around, or seek help." },
      experience: { complete: false, content: "" },
      consequences: { complete: false, content: "" },
      capability: { complete: false, content: "" }
    },
    notes: [],
    activity: [
      "Decision completed",
      "Anxiety refined",
      "Situation completed"
    ]
  }
];
