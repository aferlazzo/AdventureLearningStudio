# Adventure Learning Studio

Adventure Learning Studio is an authoring environment for creating and publishing reusable learning adventures.

Its purpose is to help authors transform knowledge into engaging, visual learning experiences.

The Studio is intentionally independent of any particular subject. It provides the tools for creating adventures; the adventures provide the content.

**Driver Confidence Guide is simply the first adventure created with the Studio.**

---

## Design Philosophy

### The Studio knows *how*. The Adventure knows *what*.

The Studio understands concepts such as:

- Adventures
- Missions
- Storyboards
- Comics
- Artwork
- Publishing

The Adventure supplies the subject matter.

### Authors think in adventures, not files.

Authors should think:

> "I'm working on the Driver Confidence Guide."

—not—

> "I'm editing Mission08.json."

The Studio hides folders, filenames, and implementation details whenever possible.

### Make the common workflow effortless.

Choose Adventure → Continue Working → Create or Edit → Review → Publish

### Hide complexity.

Technology should support creativity, not interrupt it.

### Generalize only when experience justifies it.

As additional adventures are created, common capabilities move into the Studio. Subject-specific behavior remains inside each adventure.

### Don't over-engineer.

Every feature should answer one question:

> Does this make creating learning adventures easier?

If not, it probably doesn't belong.

---

## Current Build

This starter repository currently includes:

- Adventure Library
- Adventure Workspace
- Local browser persistence
- Canonical Adventure model
- A seeded Driver Confidence Guide adventure

The Conversation Engine, Adventure Editor, Preview, Publishing Center, and Learning Engine are represented in the Workspace but intentionally remain locked until their implementation sprints begin.

## Requirements

- Node.js 20+
- npm

## Run Locally

```powershell
npm install
npm run dev
```

## Build

```powershell
npm run build
```

The deployable site is generated in the `dist` folder.
