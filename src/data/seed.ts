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

    purpose:
      "Help new and less-confident drivers become comfortable with the practical responsibilities of driving and owning a car.",
    audience:
      "New drivers, inexperienced car owners, and adults who were never taught practical car basics.",
    confidenceOutcome:
      "The learner can handle common driving and car-ownership situations calmly and safely.",

    missions: [
      {
        id: crypto.randomUUID(),
        number: 0,
        title: "Understanding the Basics",
        goal:
          "Understand the main systems and components of a gasoline-powered car.",
        realWorldAction:
          "Open the hood with an experienced person and identify the major components.",
        confidenceQuestion:
          "Could you explain the basic purpose of the engine, battery, oil, coolant, alternator, and transmission?",
        elements: [
          {
            id: crypto.randomUUID(),
            type: "Instruction",
            title: "Nobody ever taught me this",
            body:
              "This mission gives a simple overview of how a gasoline-powered car works and why its major systems matter."
          }
        ]
      },
      {
        id: crypto.randomUUID(),
        number: 1,
        title: "Dashboard Warning Lights",
        goal:
          "Recognize which dashboard warning lights require immediate attention.",
        realWorldAction:
          "Locate the warning-light section in the vehicle owner's manual.",
        confidenceQuestion:
          "Would you know what to do if a red warning light appeared while driving?",
        elements: []
      },
      {
        id: crypto.randomUUID(),
        number: 2,
        title: "Find the Owner's Manual",
        goal:
          "Know how to find the correct owner's manual for any vehicle.",
        realWorldAction:
          "Find the owner's manual for the car you drive most often.",
        confidenceQuestion:
          "Could you quickly find official instructions for a warning light or dashboard control?",
        elements: []
      }
    ],

    notes: [],
    activity: [
      "Mission architecture created",
      "Driver Confidence Guide seed data added"
    ]
  }
];