export type AdventureStatus = "draft" | "complete" | "published";

export type MissionElementType =
  | "Story"
  | "Instruction"
  | "Comic Panel"
  | "Warning"
  | "Tip"
  | "Question";

export interface MissionElement {
  id: string;
  type: MissionElementType;
  title: string;
  body: string;
}

export interface Mission {
  id: string;
  number: number;
  title: string;
  goal: string;
  realWorldAction: string;
  confidenceQuestion: string;
  elements: MissionElement[];
}

export interface Adventure {
  id: string;
  title: string;
  summary: string;
  author: string;
  created: string;
  updated: string;
  status: AdventureStatus;
  version: number;
  tags: string[];
  domain: string;

  purpose: string;
  audience: string;
  confidenceOutcome: string;

  missions: Mission[];

  notes: string[];
  activity: string[];
}