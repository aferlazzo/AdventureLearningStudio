Adventure Learning Studio Specification
Purpose

Adventure Learning Studio exists to help authors capture experience and transform it into learning adventures.

The Studio should feel like working with an experienced editor, not a software application.

The author should spend time thinking about learners—not technology.

Design Principles

The Studio must:

Hide technical complexity.
Reduce author cognitive load.
Follow the author's natural thought process.
Encourage reuse instead of duplication.
Publish anywhere from the same source.
The Author Journey

Creating a new mission should feel like answering a series of questions.

Step 1 — Situation

What happened?

Examples:

Borrowed a friend's car.
Warning light came on.
Phone won't connect.
Need to check the oil.
Step 2 — Anxiety

Why is this stressful?

Examples:

I don't know what to do.
I'm afraid I'll break something.
I don't want to look foolish.
Step 3 — Outcome

When we're finished, what will the learner be able to do?

This defines the capability.

Step 4 — Story

Who is this happening to?

Characters.

Setting.

Motivation.

Step 5 — Episodes

The Studio asks:

What's the first thing that happens?

Then:

What happens next?

Repeat until the situation is resolved.

Step 6 — Skills

The Studio automatically asks:

What skill did this episode teach?

Skills become reusable.

Step 7 — Experience

The Studio prompts:

Tony's Tip
Warning
Common mistake
Why you can relax

These become reusable learning elements.

Step 8 — Review

The Studio asks:

Does this reduce anxiety?
Does it build capability?
Is anything unnecessary?
Is there a simpler way?

Only then is the mission considered complete.

Core Objects

The Studio doesn't manage files.

It manages ideas.

Project
    Stories
        Situations
            Episodes
                Skills
                Tony's Tips
                Warnings

Everything else is generated.

Publishing

The Studio should publish to:

PDF
Google Sites
Web
Print
Mobile

Without changing the source.

Guiding Principle

The Studio should never ask the author questions the framework already knows how to answer.

If the software can infer it, automate it.

If the author must decide it, make the question natural.

Here's why I think this is the right next step

We've now moved through three layers:

Constitution — Why does Adventure Learning exist?
Architecture — How does learning flow?
Studio Specification — How should the author experience that flow?

There's one more document I'd write before touching any code:

Adventure Learning Domain Model

Not classes.

Not APIs.

Just the nouns.

For example:

Project
Story
Situation
Character
Episode
Skill
Mission
Learning Path
Tony's Tip
Warning
Resource
Assessment (if ever needed)

That document becomes the shared vocabulary for everything else. Once those concepts are clearly defined, the software design becomes much more straightforward because every screen, every feature, and every piece of data has a well-defined place in the model.