import type { Adventure } from "../models/adventure";
import { seedAdventures } from "../data/seed";

const STORAGE_KEY = "adventure-learning-studio.library.v1";

export function loadAdventures(): Adventure[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    saveAdventures(seedAdventures);
    return seedAdventures;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedAdventures;
  } catch {
    return seedAdventures;
  }
}

export function saveAdventures(adventures: Adventure[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(adventures));
}
