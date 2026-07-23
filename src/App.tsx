import { useEffect, useMemo, useRef, useState } from "react";

type JourneyStage = "welcome" | "why" | "discovery" | "reflection" | "organization";
type SaveStatus = "saving" | "saved" | "unavailable";

type DiscoveryPrompt = {
  title: string;
  guidance: string;
  placeholder: string;
};

type SavedJourney = {
  stage: JourneyStage;
  step: number;
  answers: string[];
};

const STORAGE_KEY = "als-discovery-journey";

const prompts: DiscoveryPrompt[] = [
  {
    title: "What have you learned that changed you?",
    guidance:
      "Don't worry about organizing your thoughts or writing perfectly. Imagine we're talking over coffee. Tell me what happened.",
    placeholder: "I learned..."
  },
  {
    title: "I'd love to hear the story behind that.",
    guidance:
      "What was happening in your life? What made this lesson important, difficult, surprising, or useful?",
    placeholder: "The story began when..."
  },
  {
    title: "Who do you wish had known this sooner?",
    guidance:
      "Think of a real person, your younger self, or a group of people who could benefit from what you discovered.",
    placeholder: "I wish this could help..."
  },
  {
    title: "What usually goes wrong first?",
    guidance:
      "What do beginners misunderstand, avoid, or try too soon? What would you warn them about?",
    placeholder: "A common mistake is..."
  }
];

const emptyAnswers = prompts.map(() => "");

function loadJourney(): SavedJourney {
  const fallback: SavedJourney = {
    stage: "welcome",
    step: 0,
    answers: emptyAnswers
  };

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return fallback;

    const parsed = JSON.parse(saved) as Partial<SavedJourney>;
    const answers = Array.isArray(parsed.answers)
      ? prompts.map((_, index) => String(parsed.answers?.[index] ?? ""))
      : emptyAnswers;
    const step = Math.min(Math.max(Number(parsed.step) || 0, 0), prompts.length - 1);
    const validStages: JourneyStage[] = [
      "welcome",
      "why",
      "discovery",
      "reflection",
      "organization"
    ];
    const stage = validStages.includes(parsed.stage as JourneyStage)
      ? (parsed.stage as JourneyStage)
      : "welcome";

    return { stage, step, answers };
  } catch {
    return fallback;
  }
}

function hasMeaningfulDraft(journey: SavedJourney) {
  return (
    (journey.stage !== "welcome" && journey.stage !== "why") ||
    journey.answers.some((answer) => answer.trim())
  );
}

export default function App() {
  const savedJourney = useMemo(loadJourney, []);
  const restoredDraft = useMemo(() => hasMeaningfulDraft(savedJourney), [savedJourney]);
  const firstSave = useRef(true);
  const [stage, setStage] = useState<JourneyStage>(savedJourney.stage);
  const [step, setStep] = useState(savedJourney.step);
  const [answers, setAnswers] = useState<string[]>(savedJourney.answers);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [showResumeNotice, setShowResumeNotice] = useState(restoredDraft);
  const [confirmRestart, setConfirmRestart] = useState(false);

  useEffect(() => {
    if (!firstSave.current) setSaveStatus("saving");

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ stage, step, answers } satisfies SavedJourney)
      );

      const timer = window.setTimeout(() => setSaveStatus("saved"), 250);
      firstSave.current = false;
      return () => window.clearTimeout(timer);
    } catch {
      setSaveStatus("unavailable");
      firstSave.current = false;
    }
  }, [stage, step, answers]);

  const currentAnswer = answers[step] ?? "";
  const canContinue = currentAnswer.trim().length > 0;

  const progressMessage = useMemo(() => {
    const messages = [
      "Let's begin with your experience.",
      "We're beginning to understand your story.",
      "Now we're discovering who this could help.",
      "We're finding the lessons hidden inside your experience."
    ];

    return messages[step];
  }, [step]);

  function updateCurrentAnswer(value: string) {
    setAnswers((current) =>
      current.map((answer, index) => (index === step ? value : answer))
    );
  }

  function continueDiscovery() {
    if (!canContinue) return;

    if (step === prompts.length - 1) {
      setStage("reflection");
      return;
    }

    setStep((current) => current + 1);
  }

  function goBack() {
    if (step === 0) {
      setStage("welcome");
      return;
    }

    setStep((current) => current - 1);
  }

  function restart() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // State will still be cleared in this browser session.
    }

    setAnswers(prompts.map(() => ""));
    setStep(0);
    setStage("welcome");
    setConfirmRestart(false);
    setShowResumeNotice(false);
  }

  function resumeJourney() {
    setShowResumeNotice(false);
    if (stage === "welcome" || stage === "why") setStage("discovery");
  }

  const saveLabel =
    saveStatus === "saving"
      ? "Saving..."
      : saveStatus === "saved"
        ? "✓ Saved locally"
        : "Local saving is unavailable";

  const resumeNotice = showResumeNotice ? (
    <aside className="resume-notice" role="status">
      <div>
        <strong>Welcome back.</strong>
        <span> We restored your previous conversation.</span>
      </div>
      <button type="button" onClick={resumeJourney}>
        Continue
      </button>
    </aside>
  ) : null;

  const restartControl = confirmRestart ? (
    <div className="restart-confirmation" role="group" aria-label="Start a new story">
      <p>
        <strong>Start a new story?</strong> Your current local draft will be cleared.
      </p>
      <div>
        <button
          className="journey-button journey-button-secondary"
          type="button"
          onClick={() => setConfirmRestart(false)}
        >
          Keep This Draft
        </button>
        <button className="journey-button danger-button" type="button" onClick={restart}>
          Clear Draft and Start Over
        </button>
      </div>
    </div>
  ) : (
    <button className="text-button" type="button" onClick={() => setConfirmRestart(true)}>
      Start a New Story
    </button>
  );

  if (stage === "welcome") {
    return (
      <main className="journey-shell welcome-shell">
        <section className="welcome-page" aria-labelledby="welcome-title">
          {resumeNotice}
          <p className="brand-kicker">Adventure Learning Studio</p>
          <h1 id="welcome-title">Everyone has something worth teaching.</h1>
          <p className="welcome-promise">We'll help you teach it.</p>

          <div className="welcome-body">
            <h2>What have you learned in life that could help someone else?</h2>
            <p>
              You don't need teaching experience, an outline, or perfectly written
              ideas. You only need something you've learned through experience.
            </p>
            <ul>
              <li>How to become more confident behind the wheel</li>
              <li>How to care for a new puppy</li>
              <li>How to grow tomatoes in a difficult climate</li>
              <li>How to repair a bicycle</li>
              <li>How to comfort a frightened child</li>
              <li>How to start a small business</li>
            </ul>
          </div>

          <button
            className="journey-button journey-button-primary"
            type="button"
            onClick={() => setStage("discovery")}
          >
            {restoredDraft ? "Continue My Story" : "Let's Begin"}
          </button>

          <button className="text-button" type="button" onClick={() => setStage("why")}>
            Why?
          </button>
          <p className="welcome-note">Your experience is the starting point.</p>
          {restoredDraft && restartControl}
        </section>
      </main>
    );
  }

  if (stage === "why") {
    return (
      <main className="journey-shell">
        <article className="conversation-card reflection-card" aria-labelledby="why-title">
          {resumeNotice}
          <p className="brand-kicker">Adventure Learning Studio</p>
          <h1 id="why-title">Why?</h1>
          <p className="reflection-intro">
            Because the world's most valuable knowledge isn't always found in classrooms
            or textbooks. It's found in people.
          </p>

          <div className="reflection-list">
            <div>
              <dt>This is personal.</dt>
              <dd>
                Every Learning Adventure begins with something you experienced, something
                that frustrated you, something that changed you, something you finally
                figured out, or something you wish someone had told you sooner. ALS begins
                by asking about your life because that's where your most valuable lessons
                are found.
              </dd>
            </div>
            <div>
              <dt>Everyone has something worth teaching.</dt>
              <dd>
                You don't need a teaching degree or a formal title. If you've learned
                something that could help another person, you already have the beginning
                of a Learning Adventure.
              </dd>
            </div>
            <div>
              <dt>We'll help you teach it.</dt>
              <dd>
                You don't need an outline or knowledge of course design. Tell your story.
                ALS will help you discover the ideas, lessons, and experiences others can
                learn from.
              </dd>
            </div>
            <div>
              <dt>You decide. I remember.</dt>
              <dd>
                You remain the author. You decide what matters, what changes, and what gets
                published. ALS remembers what you've shared, helps organize your thinking,
                and supports your decisions without taking ownership away from you.
              </dd>
            </div>
          </div>

          <div className="reflection-callout">
            <h2>Our promise</h2>
            <p>
              We'll never replace your voice or tell your story for you. We'll help you
              discover it, organize it, and share it with others.
            </p>
          </div>

          <div className="reflection-callout" style={{ marginTop: "24px" }}>
            <h2>What you'll leave with</h2>
            <p>
              By the end of this journey, you'll have created your first <strong>Learning
              Adventure</strong>—something another person can use to gain confidence from
              your experience.
            </p>
            <p>
              But you'll leave with something else, too. You'll begin to see your own
              experiences differently. What once felt like “just things that happened”
              become lessons that can help someone else.
            </p>
            <p>
              You'll discover that you know more than you realized, and you'll become a
              better teacher because you'll better understand what you learned, why it
              mattered, and how to share it.
            </p>
            <p>
              You don't begin this journey because you're already an expert. You begin
              because you've lived a life. <strong>That's enough.</strong>
            </p>
          </div>

          <div className="conversation-actions">
            <button
              className="journey-button journey-button-secondary"
              type="button"
              onClick={() => setStage("welcome")}
            >
              Back
            </button>
            <button
              className="journey-button journey-button-primary"
              type="button"
              onClick={() => setStage("discovery")}
            >
              {restoredDraft ? "Continue My Story" : "Let's Begin"}
            </button>
          </div>
        </article>
      </main>
    );
  }

  if (stage === "organization") {
    return (
      <main className="journey-shell">
        <section className="conversation-card reflection-card" aria-labelledby="organization-title">
          {resumeNotice}
          <p className="conversation-progress">Wonderful.</p>
          <h1 id="organization-title">Let's find the shape inside your story.</h1>
          <p className="reflection-intro">
            I can already see several themes emerging from what you shared. The next
            step is to organize them into Learning Adventures without losing your
            voice or ownership.
          </p>

          <div className="reflection-callout">
            <h2>Organization is the next ALS journey phase.</h2>
            <p>
              This first version now carries you here naturally instead of interrupting
              you with a browser pop-up.
            </p>
          </div>

          <div className="conversation-actions">
            <button
              className="journey-button journey-button-secondary"
              type="button"
              onClick={() => setStage("reflection")}
            >
              Back
            </button>
            <button className="journey-button journey-button-primary" type="button" disabled>
              Build My Adventures
            </button>
          </div>

          <p className={`save-status ${saveStatus}`} aria-live="polite">{saveLabel}</p>
          {restartControl}
        </section>
      </main>
    );
  }

  if (stage === "reflection") {
    return (
      <main className="journey-shell">
        <section className="conversation-card reflection-card" aria-labelledby="reflection-title">
          {resumeNotice}
          <p className="conversation-progress">I think I understand...</p>
          <h1 id="reflection-title">Your experience contains something worth sharing.</h1>
          <p className="reflection-intro">
            Here is the beginning of the learning experience I hear in your story.
          </p>

          <dl className="reflection-list">
            <div>
              <dt>What changed you</dt>
              <dd>{answers[0]}</dd>
            </div>
            <div>
              <dt>The story behind it</dt>
              <dd>{answers[1]}</dd>
            </div>
            <div>
              <dt>Who this could help</dt>
              <dd>{answers[2]}</dd>
            </div>
            <div>
              <dt>Where beginners struggle</dt>
              <dd>{answers[3]}</dd>
            </div>
          </dl>

          <div className="reflection-callout">
            <h2>I can see the beginnings of several Learning Adventures.</h2>
            <p>
              The next step will be identifying the recurring ideas and organizing
              them without losing your voice or ownership.
            </p>
          </div>

          <div className="conversation-actions">
            <button
              className="journey-button journey-button-secondary"
              type="button"
              onClick={() => {
                setStep(prompts.length - 1);
                setStage("discovery");
              }}
            >
              Review My Answers
            </button>
            <button
              className="journey-button journey-button-primary"
              type="button"
              onClick={() => setStage("organization")}
            >
              Show Me
            </button>
          </div>

          <p className={`save-status ${saveStatus}`} aria-live="polite">{saveLabel}</p>
          {restartControl}
        </section>
      </main>
    );
  }

  const prompt = prompts[step];

  return (
    <main className="journey-shell">
      <section className="conversation-card" aria-labelledby="conversation-title">
        {resumeNotice}
        <div className="conversation-topline">
          <p className="brand-kicker">Adventure Learning Studio</p>
          <p className="conversation-count">
            Conversation {step + 1} of {prompts.length}
          </p>
        </div>

        <p className="conversation-progress">{progressMessage}</p>
        <h1 id="conversation-title">{prompt.title}</h1>
        <p className="conversation-guidance">{prompt.guidance}</p>

        <label className="sr-only" htmlFor="discovery-answer">
          Your response
        </label>
        <textarea
          id="discovery-answer"
          value={currentAnswer}
          placeholder={prompt.placeholder}
          onChange={(event) => updateCurrentAnswer(event.target.value)}
          autoFocus={!showResumeNotice}
        />

        <div className="conversation-actions">
          <button
            className="journey-button journey-button-secondary"
            type="button"
            onClick={goBack}
          >
            Back
          </button>
          <button
            className="journey-button journey-button-primary"
            type="button"
            disabled={!canContinue}
            onClick={continueDiscovery}
          >
            Continue
          </button>
        </div>

        <p className={`save-status ${saveStatus}`} aria-live="polite">{saveLabel}</p>
      </section>
    </main>
  );
}
