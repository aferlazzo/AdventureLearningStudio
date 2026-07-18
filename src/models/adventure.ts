export type AdventureStatus = "draft" | "complete" | "published";

export type AdventureSectionKey =
  | "situation"
  | "anxiety"
  | "decision"
  | "experience"
  | "consequences"
  | "capability";

export interface AdventureSection {
  complete: boolean;
  content: string;
  answers?: string[];
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
  sections: Record<AdventureSectionKey, AdventureSection>;
  notes: string[];
  activity: string[];
}
