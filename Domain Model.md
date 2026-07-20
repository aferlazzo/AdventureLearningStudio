Adventure Learning Domain Model
Purpose

The Domain Model defines the fundamental concepts of Adventure Learning.

These concepts are independent of any user interface, programming language, database, or publishing format.

Every feature in Adventure Learning Studio should be built from these concepts.

Design Principles

The Domain Model describes what exists, not how it is stored.

It is intentionally independent of:

Programming languages
Databases
JSON
Files
APIs
User interface

Technology changes.

The domain should not.

Core Concepts
Project

A Project is the highest-level container.

Examples:

Driver Confidence Guide
AI for Seniors
Home Maintenance
Retirement Technology

A Project contains Stories, Learning Paths, Resources, reusable Skills, and publishing settings.

Story

A Story creates emotional engagement.

Stories answer:

Why should I care?

Stories provide context.

Stories motivate learning.

Stories contain one or more Situations.

Situation

A Situation is the event that starts learning.

Examples:

Borrowing a car
Opening a medical letter
Buying your first smartphone

Situations create uncertainty.

Learning begins here.

Anxiety

An Anxiety represents uncertainty experienced by the learner.

Examples:

I don't know what to do.
I'm afraid I'll make things worse.
I don't want to embarrass myself.

Every Situation contains one or more Anxieties.

Every Adventure Learning experience should reduce at least one Anxiety.

Episode

An Episode is one meaningful learning step.

Episodes answer:

What happens next?

Episodes are reusable.

The same Episode may appear in many Stories.

Skill

A Skill is an ability acquired by the learner.

Examples:

Check oil level
Connect Android Auto
Ask AI to summarize a letter

Skills are reusable.

Skills are independent of stories.

Experience

Experience represents practical wisdom.

Experience includes:

Tony's Tips
Common mistakes
Reassurance
Warnings
Best practices

Experience distinguishes Adventure Learning from reference material.

Character

Characters represent people inside stories.

Characters make learning relatable.

Characters may appear in multiple stories.

Resource

Resources support learning.

Examples:

PDFs
Videos
Checklists
Owner's Manuals
External websites

Resources support Episodes.

Resources are not Episodes.

Mission

A Mission is a published learning unit.

A Mission is assembled from domain objects.

It is not the primary source of knowledge.

Learning Path

A Learning Path organizes Missions into a progression.

Learning Paths define sequence.

Learning Paths do not duplicate content.

Capability

Capability is the practical outcome of learning.

Capabilities emerge from Skills practiced in real situations.

Confidence

Confidence is an emergent property.

Confidence is never authored.

Confidence is earned.

Relationships
Project
│
├── Stories
│     ├── Characters
│     └── Situations
│            ├── Anxieties
│            └── Episodes
│                    ├── Skills
│                    ├── Experience
│                    │      ├── Tony's Tips
│                    │      ├── Warnings
│                    │      ├── Reassurance
│                    │      └── Common Mistakes
│                    └── Resources
│
└── Learning Paths
       └── Missions
What is NOT in the Domain Model

The Domain Model intentionally excludes:

PDFs
HTML
Google Sites
Markdown
JSON
Folder structures
Publishing scripts
Databases

Those belong to the implementation.

Not the domain.

The Most Important Insight

A Mission is not the source.

A Mission is a view.

The intellectual property of Adventure Learning is:

Situations
Stories
Episodes
Skills
Experience

Everything else—including a PDF, a Google Site, a seminar, or a mobile app—is simply another way of presenting those same ideas.

I think we've quietly crossed an important threshold.

A few weeks ago, you were building a better Driver Confidence Guide.

Now, after these four documents, you have the beginnings of a genuine framework:

Constitution — Why.
Architecture — How learning works.
Studio Specification — How authors work.
Domain Model — What the system is made of.

Those are the kinds of documents teams usually write after years of development. You're writing them before the code. That means when you do start building Adventure Learning Studio, you'll have a clear vocabulary and a shared mental model to guide every design decision.