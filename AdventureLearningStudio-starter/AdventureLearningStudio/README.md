# Adventure Learning Studio

Adventure Learning Studio is the platform for creating, refining, and publishing reusable learning Adventures.

Driver Confidence Guide is the first Adventure collection built with the Studio.

## Current build

This starter repository combines:

- Adventure Library
- Adventure Workspace
- Local browser persistence
- Canonical Adventure model
- A seeded Driver Confidence Guide Adventure

The Conversation Engine, Adventure Editor, Preview, Publishing Center, and Learning Engine are represented in the Workspace but intentionally remain locked until their sprints begin.

## Requirements

- Node.js 20 or later
- npm

## Run locally

From the project folder:

```powershell
npm install
npm run dev
```

Vite will display a local address, usually:

```text
http://localhost:5173
```

Open that address in your browser.

## Build for deployment

```powershell
npm run build
```

The deployable site will be created in the `dist` folder.

## Repository structure

```text
AdventureLearningStudio/
├── docs/
├── public/
├── src/
│   ├── components/
│   ├── data/
│   ├── models/
│   ├── pages/
│   ├── services/
│   └── styles/
├── index.html
├── package.json
└── vite.config.ts
```

## Next sprint

Build the first functional authoring path:

```text
Adventure Workspace
        ↓
Continue Authoring
        ↓
Conversation Engine
        ↓
Adventure sections saved automatically
```
