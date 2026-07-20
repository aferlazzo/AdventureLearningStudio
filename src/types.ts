export type TextElementType =
  | "Story"
  | "Instruction"
  | "Warning"
  | "Tip"
  | "Question"
  | "Action"
  | "Reflection"
  | "Confidence Check";

export interface TextElement {
  id: number;
  type: TextElementType;
  title: string;
  body: string;
}

export interface ComicPanel {
  id: number;
  type: "Comic Panel";
  title: string;
  image: string;
  caption: string;
  altText: string;
  notes: string;
}

export type MissionElement =
  | TextElement
  | ComicPanel;

export interface Mission {
  number: string;
  title: string;
  goal: string;
  realWorldAction: string;
  confidenceQuestion: string;
  elements: MissionElement[];
}

export interface Adventure {
  id: string;
  name: string;
  purpose: string;
  audience: string;
  confidenceOutcome: string;
  missions: Mission[];
}