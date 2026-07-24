# Adventure Learning Studio Data Model

**Milestone 2 — Version 1.0 Draft**

## Purpose

This document defines the minimum data model Adventure Learning Studio needs to create, manage, preview, and publish a Learning Adventure.

The model follows the Learning Adventure Method:

```text
Adventure
  → Missions
    → Story
    → Storyboard
    → Panels
    → Dialogue
    → HTML
    → Preview
    → Publish
```

The model is intentionally small. Version 1 should support the real Driver Confidence Guide workflow without becoming a general-purpose content-management system.

## Design rules

1. **One source of truth.** Authoring content is stored once. HTML and previews are generated from that content whenever possible.
2. **Stable IDs.** Adventures, missions, scenes, panels, dialogue entries, and assets use UUIDs. Titles and mission numbers may change; IDs do not.
3. **Ordered arrays.** Missions, scenes, panels, and dialogue entries are stored in display order.
4. **Assets are referenced, not embedded.** Mission data stores asset IDs or relative paths rather than image bytes.
5. **Progress is explicit.** Each production stage has a status that the workspace can display.
6. **Publishing is separate from authoring.** A published version is a snapshot or generated output, not a second editable copy of the mission.
7. **Derived data should remain derived.** Preview markup, completion percentages, and navigation are calculated rather than manually maintained.

---

# 1. Adventure

An Adventure is the top-level project. Driver Confidence Guide is one Adventure.

```ts
export type AdventureStatus =
  | "draft"
  | "in_review"
  | "ready"
  | "published"
  | "archived";

export interface Adventure {
  schemaVersion: 1;

  id: string;
  slug: string;
  title: string;
  summary: string;
  author: string;
  domain: string;
  tags: string[];

  purpose: string;
  audience: string;
  confidenceOutcome: string;

  status: AdventureStatus;
  version: string;

  missions: Mission[];
  assets: Asset[];
  publishing: PublishingSettings;

  notes: Note[];
  activity: ActivityEntry[];

  createdAt: string;
  updatedAt: string;
}
```

## Adventure fields

| Field | Purpose |
|---|---|
| `schemaVersion` | Allows future migrations when the structure changes. |
| `id` | Permanent internal identity. |
| `slug` | URL-safe name such as `driver-confidence-guide`. |
| `title` | Display name. |
| `summary` | Short description shown in the Adventure Library. |
| `purpose` | Why the Adventure exists. |
| `audience` | Who it is designed for. |
| `confidenceOutcome` | What learners should feel confident doing when complete. |
| `status` | Overall production state. |
| `version` | Human-readable release version such as `1.0`. |
| `missions` | Ordered mission list. |
| `assets` | Adventure-wide asset catalog. |
| `publishing` | Website output and deployment settings. |

---

# 2. Mission

A Mission is one small, practical step in the learner's journey.

```ts
export type StageStatus =
  | "not_started"
  | "in_progress"
  | "ready"
  | "complete"
  | "not_required";

export interface MissionProgress {
  story: StageStatus;
  storyboard: StageStatus;
  panels: StageStatus;
  dialogue: StageStatus;
  html: StageStatus;
  preview: StageStatus;
  publish: StageStatus;
}

export interface Mission {
  id: string;
  number: number;
  slug: string;
  title: string;
  summary: string;

  goal: string;
  confidenceQuestion: string;
  realWorldAction: string;

  story: Story;
  storyboard: Storyboard;
  panels: Panel[];
  dialogue: DialogueEntry[];
  html: HtmlDocument;
  preview: PreviewSettings;

  assetIds: string[];
  progress: MissionProgress;
  publishState: MissionPublishState;

  notes: Note[];
  createdAt: string;
  updatedAt: string;
}
```

## Mission identity

- `id` is permanent.
- `number` controls visible sequence and may be changed.
- `slug` controls the output filename or URL.

Example:

```text
Mission 02
Title: Find Your Owner's Manual
Slug: find-owners-manual
Output: missions/mission-02-find-owners-manual.html
```

---

# 3. Story

The Story stores the authored learning narrative and instructional content. It is the main source used to build the mission page.

```ts
export interface Story {
  premise: string;
  learnerProblem: string;
  opening: string;
  body: ContentBlock[];
  closing: string;
  keyTakeaways: string[];
}

export type ContentBlockType =
  | "heading"
  | "paragraph"
  | "instruction"
  | "warning"
  | "tip"
  | "question"
  | "action"
  | "image";

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  title?: string;
  text?: string;
  assetId?: string;
  altText?: string;
}
```

### Decision

The current `MissionElement[]` concept becomes `Story.body: ContentBlock[]`. This preserves the useful block-based editing approach while placing it inside the Story stage rather than treating the entire mission as an undifferentiated list of elements.

---

# 4. Storyboard

The Storyboard divides the mission into planned scenes before artwork is created.

```ts
export interface Storyboard {
  overview: string;
  scenes: StoryboardScene[];
}

export interface StoryboardScene {
  id: string;
  order: number;
  title: string;
  purpose: string;
  setting: string;
  characters: string[];
  action: string;
  visualDirection: string;
  narration?: string;
  panelIds: string[];
}
```

A scene may produce one or several comic panels. `panelIds` connects the plan to the finished panels without embedding panel data twice.

---

# 5. Panels

A Panel represents one visual storytelling frame.

```ts
export type PanelStatus =
  | "planned"
  | "prompt_ready"
  | "generated"
  | "approved"
  | "needs_revision";

export interface Panel {
  id: string;
  order: number;
  sceneId: string;

  title: string;
  description: string;
  imagePrompt: string;
  negativePrompt?: string;

  assetId?: string;
  altText: string;
  caption?: string;

  status: PanelStatus;
}
```

The image itself belongs in the Asset catalog. The Panel stores the creative instructions, accessibility text, and reference to the chosen asset.

---

# 6. Dialogue

Dialogue is stored separately from the image so it can be edited, reviewed, searched, translated, or rendered as HTML without regenerating artwork.

```ts
export type DialogueKind =
  | "speech"
  | "thought"
  | "narration"
  | "caption"
  | "sound_effect";

export interface DialogueEntry {
  id: string;
  panelId: string;
  order: number;
  kind: DialogueKind;
  speaker?: string;
  text: string;
}
```

### Decision

Version 1 should keep dialogue outside generated images whenever practical. Text baked into images is difficult to correct and inaccessible to screen readers.

---

# 7. HTML

HTML is the generated mission-page output. The authoring content remains the source of truth.

```ts
export interface HtmlDocument {
  templateId: string;
  generatedMarkup: string;
  customHead?: string;
  customCss?: string;
  customBodyEnd?: string;
  generatedAt?: string;
  sourceHash?: string;
}
```

## Storage policy

- `templateId` and optional overrides are stored.
- `generatedMarkup` may be cached for export and debugging.
- The HTML must be regenerated whenever the source content changes.
- `sourceHash` allows ALS to determine whether cached HTML is stale.

The HTML editor is therefore an **inspection and controlled-override tool**, not the primary authoring surface.

---

# 8. Preview

Preview is primarily derived from the current mission data and generated HTML. ALS should not maintain a second editable copy of the mission merely for previewing it.

```ts
export type PreviewDevice = "desktop" | "tablet" | "mobile";

export interface PreviewSettings {
  device: PreviewDevice;
  showNavigation: boolean;
  showDraftBanner: boolean;
  lastReviewedAt?: string;
  approvedAt?: string;
}
```

## What is stored

- The author's preferred preview device.
- Whether navigation and draft indicators are shown.
- Review and approval timestamps.

## What is derived

- Rendered preview markup.
- Previous/next mission links.
- Completion indicators.
- Current page appearance.

This avoids the classic problem of the editor and preview quietly drifting apart.

---

# 9. Status and progress

The right-hand Production Pipeline reads `Mission.progress`.

```text
Story        complete
Storyboard   complete
Panels       in_progress
Dialogue     not_started
HTML         not_started
Preview      not_started
Publish      not_started
```

ALS may suggest status changes, but the author remains in control. For example:

- Adding the first Story block can change Story from `not_started` to `in_progress`.
- The author marks Story `complete` after review.
- A stage may be `not_required`; not every mission needs comic panels or dialogue.

## Mission publish state

```ts
export interface MissionPublishState {
  isIncluded: boolean;
  lastPublishedAt?: string;
  lastPublishedVersion?: string;
  publishedSourceHash?: string;
}
```

`publishedSourceHash` allows ALS to show that a mission has changed since it was last published.

---

# 10. Assets

Assets are files used by the Adventure: images, diagrams, icons, audio, video, documents, or other media.

```ts
export type AssetType =
  | "image"
  | "diagram"
  | "icon"
  | "audio"
  | "video"
  | "document"
  | "other";

export interface Asset {
  id: string;
  type: AssetType;
  filename: string;
  relativePath: string;
  mimeType: string;

  title: string;
  description?: string;
  altText?: string;
  source?: string;
  license?: string;

  width?: number;
  height?: number;
  fileSize?: number;
  checksum?: string;

  createdAt: string;
  updatedAt: string;
}
```

## Asset rules

1. The file lives in the project asset folder.
2. The Adventure stores metadata and a relative path.
3. Missions and panels refer to `assetId`.
4. Deleting an asset must warn when it is still referenced.
5. Renaming a file should update one Asset record rather than every mission.

Suggested project layout:

```text
adventure-data/
  adventure.json
  assets/
    shared/
    missions/
      mission-00/
      mission-01/
  generated/
    website/
```

---

# 11. Publishing

Publishing settings belong to the Adventure because they affect the complete website.

```ts
export type PublishTargetType = "website";

export interface PublishingSettings {
  target: PublishTargetType;
  outputDirectory: string;
  baseUrl: string;

  homePageTemplateId: string;
  missionTemplateId: string;
  themeId: string;

  includeDraftMissions: boolean;
  generateNavigation: boolean;
  copyAssets: boolean;

  lastBuild?: BuildRecord;
  deployments: DeploymentRecord[];
}

export interface BuildRecord {
  id: string;
  version: string;
  startedAt: string;
  completedAt?: string;
  status: "running" | "succeeded" | "failed";
  outputDirectory: string;
  errors: string[];
  warnings: string[];
}

export interface DeploymentRecord {
  id: string;
  buildId: string;
  targetName: string;
  deployedAt: string;
  url?: string;
  commitSha?: string;
  status: "succeeded" | "failed";
}
```

### Version 1 boundary

Version 1 has one primary publishing target: a static website. PDF, LMS, mobile-app, and print outputs belong in the future parking lot unless a real requirement emerges.

---

# 12. Notes and activity

```ts
export interface Note {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  action: string;
  entityType: "adventure" | "mission" | "asset" | "publish";
  entityId: string;
}
```

Activity should remain a lightweight history, not a full audit system.

---

# 13. Complete relationship model

```text
Adventure
├── metadata
├── purpose / audience / confidence outcome
├── missions[]
│   └── Mission
│       ├── Story
│       │   └── ContentBlocks[]
│       ├── Storyboard
│       │   └── Scenes[]
│       ├── Panels[] ───────────────┐
│       ├── Dialogue[] → Panel ID   │
│       ├── HTML cache              │
│       ├── Preview settings        │
│       ├── Progress                │
│       └── Asset IDs ──────────────┤
├── Assets[] ◄──────────────────────┘
├── Publishing settings
├── Notes[]
└── Activity[]
```

---

# 14. Example mission record

```json
{
  "id": "b84e72d0-785b-4b81-9868-52f64e0cde29",
  "number": 2,
  "slug": "find-owners-manual",
  "title": "Find Your Owner's Manual",
  "summary": "Learn where to find the official instructions for any car you drive.",
  "goal": "Locate the correct owner's manual for the vehicle.",
  "confidenceQuestion": "Could I find the manual for an unfamiliar car?",
  "realWorldAction": "Find the owner's manual for the car you use most often.",
  "story": {
    "premise": "Maya is using an unfamiliar car and needs an answer about the dashboard.",
    "learnerProblem": "She does not know where to find reliable vehicle-specific information.",
    "opening": "The answer is probably already available in the official manual.",
    "body": [],
    "closing": "Keep the manual location or link where you can find it again.",
    "keyTakeaways": [
      "Check the glove compartment.",
      "Use the manufacturer's website or the vehicle VIN."
    ]
  },
  "storyboard": {
    "overview": "Maya searches the car and then finds the official digital manual.",
    "scenes": []
  },
  "panels": [],
  "dialogue": [],
  "html": {
    "templateId": "dcg-mission-v1",
    "generatedMarkup": ""
  },
  "preview": {
    "device": "desktop",
    "showNavigation": true,
    "showDraftBanner": true
  },
  "assetIds": [],
  "progress": {
    "story": "in_progress",
    "storyboard": "not_started",
    "panels": "not_started",
    "dialogue": "not_started",
    "html": "not_started",
    "preview": "not_started",
    "publish": "not_started"
  },
  "publishState": {
    "isIncluded": true
  },
  "notes": [],
  "createdAt": "2026-07-24T15:00:00.000Z",
  "updatedAt": "2026-07-24T15:00:00.000Z"
}
```

---

# 15. Migration from the current model

The current model already has useful foundations:

```text
Adventure
- identity and metadata
- purpose
- audience
- confidence outcome
- missions
- notes and activity

Mission
- identity
- number and title
- goal
- real-world action
- confidence question
- elements
```

Migration should be incremental:

1. Add `schemaVersion` and `slug` to Adventure.
2. Rename timestamps to `createdAt` and `updatedAt` when convenient.
3. Add `slug`, `summary`, timestamps, progress, and publish state to Mission.
4. Move existing `MissionElement[]` into `mission.story.body`.
5. Add empty Storyboard, Panels, Dialogue, HTML, and Preview structures.
6. Add Adventure Assets and Publishing settings.
7. Add a loader migration so existing browser-stored Adventures remain usable.

Do not rewrite the entire application at once. The data migration should be completed and tested before the workspace UI is redesigned around it.

---

# 16. Milestone 2 completion criteria

Milestone 2 is complete when:

- [x] Adventure structure is defined.
- [x] Mission structure is defined.
- [x] Story, Storyboard, Panels, Dialogue, HTML, Preview, and Status are defined.
- [x] Asset ownership and references are defined.
- [x] Website publishing data is defined.
- [x] Current-to-new-model migration is described.
- [ ] The proposed model is reviewed against one complete Driver Confidence Guide mission.
- [ ] Final Version 1 fields are approved.
- [ ] TypeScript interfaces replace the existing model.
- [ ] Existing saved data migrates successfully.

The next task is **validation**, not UI design: take one real DCG mission and confirm that every piece of its authoring content has a clear place in this model. Only after that validation should implementation begin.
