# ADVENTURE.md

# Adventure Object Specification

## Purpose

An **Adventure** is the canonical source of truth for Adventure
Learning.

Every Conversation writes to an Adventure. Every Workspace edits an
Adventure. Every Publishing Engine generates content from an Adventure.
Every Learning Engine analysis begins with an Adventure.

The platform never edits Missions, comics, websites, seminars, or PDFs
directly. Those are generated artifacts.

------------------------------------------------------------------------

# Design Principles

-   One Adventure teaches one primary capability.
-   Every Adventure is based on a real-world situation.
-   Adventures are technology independent.
-   Adventures are human-readable.
-   Adventures are suitable for long-term storage as Markdown with front
    matter.
-   The Adventure is the common language of the platform.

------------------------------------------------------------------------

# Adventure Lifecycle

``` text
Conversation Engine
        ↓
Adventure Draft
        ↓
Adventure Workspace
        ↓
Review
        ↓
Complete Adventure
        ↓
Publishing Engine
        ↓
Mission • Comic • Website • PDF • Seminar
        ↓
Learning Engine
        ↓
Improved Platform
```

------------------------------------------------------------------------

# Canonical Adventure

## Metadata

``` yaml
id:
title:
summary:
author:
created:
updated:
status: draft | complete | published
version:
tags:
domain:
```

Purpose:

Identify, organize, search, and manage Adventures.

------------------------------------------------------------------------

## Situation

Describes the real-world situation that begins the Adventure.

Fields:

-   title
-   description
-   context
-   trigger

------------------------------------------------------------------------

## Anxiety

Describes the learner's uncertainty.

Fields:

-   description
-   learner_questions\[\]
-   fears\[\]

------------------------------------------------------------------------

## Decision

Describes the critical decision the learner must make.

Fields:

-   question
-   options\[\]
-   recommended_action

------------------------------------------------------------------------

## Experience

Captures expert thinking.

Fields:

-   expert_story
-   expert_reasoning
-   clues\[\]
-   steps\[\]

------------------------------------------------------------------------

## Consequences

Explains what happens as a result of the learner's decision.

Fields:

-   warnings\[\]
-   mistakes\[\]
-   best_case
-   worst_case

------------------------------------------------------------------------

## Capability

Defines what success looks like.

Fields:

-   statement
-   confidence_goal
-   success_criteria\[\]

------------------------------------------------------------------------

## Story

Optional narrative that supports learning.

Fields:

-   characters\[\]
-   setting
-   opening
-   resolution

------------------------------------------------------------------------

## Episodes

Break the Adventure into teachable moments.

Each Episode contains:

-   title
-   goal
-   skill
-   content
-   comic_panels\[\]

------------------------------------------------------------------------

## Skills

Skills are first-class learning outcomes.

``` text
primary[]

supporting[]
```

The Learning Engine uses Skills to:

-   detect prerequisite Adventures
-   identify curriculum gaps
-   recommend related Adventures
-   measure curriculum coverage

------------------------------------------------------------------------

## Tips

Optional practical advice that improves learner success.

------------------------------------------------------------------------

## Warnings

Optional safety, legal, or operational warnings.

------------------------------------------------------------------------

## Resources

Supporting material.

Fields:

-   links\[\]
-   images\[\]
-   references\[\]
-   downloads\[\]

------------------------------------------------------------------------

# Platform Metadata

Used internally by Adventure Learning.

Examples:

-   relationships
-   prerequisites
-   follow_up_adventures
-   learning_metrics
-   review_history

------------------------------------------------------------------------

# Publishing Metadata

Used by publishing engines.

Examples:

-   audience
-   difficulty
-   estimated_time
-   outputs
-   publishing_notes

Publishing metadata controls presentation, not educational content.

------------------------------------------------------------------------

# Relationships

An Adventure may:

-   reference another Adventure
-   require prerequisite Adventures
-   recommend follow-up Adventures

The Learning Engine maintains these relationships.

------------------------------------------------------------------------

# Validation Rules

A complete Adventure must contain:

-   Metadata
-   Situation
-   Anxiety
-   Decision
-   Experience
-   Consequences
-   Capability

Story, Episodes, Skills, Tips, Warnings, Resources, and Publishing
Metadata are optional but encouraged where appropriate.

------------------------------------------------------------------------

# Guiding Rule

If new information does not naturally belong inside an Adventure,
question whether it belongs in the platform at all.

The Adventure object is the foundation upon which every component of
Adventure Learning is built.
