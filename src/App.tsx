import { useMemo, useState } from "react";

type JourneyStage = "welcome" | "discovery" | "reflection" | "organization";

type DiscoveryPrompt = {
  title: string;
  guidance: string;
  placeholder: string;
};

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

export default function App() {
  const [stage, setStage] = useState<JourneyStage>("welcome");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(emptyAnswers);

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
    setAnswers(emptyAnswers);
    setStep(0);
    setStage("welcome");
  }

  if (stage === "welcome") {
    return (
      <main className="journey-shell welcome-shell">
        <section className="welcome-page" aria-labelledby="welcome-title">
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
            Let's Begin
          </button>

          <p className="welcome-note">Your experience is the starting point.</p>
        </section>
      </main>
    );
  }

  if (stage === "organization") {
    return (
      <main className="journey-shell">
        <section className="conversation-card reflection-card" aria-labelledby="organization-title">
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
            <button
              className="journey-button journey-button-primary"
              type="button"
              disabled
            >
              Build My Adventures
            </button>
          </div>

          <button className="text-button" type="button" onClick={restart}>
            Start a different story
          </button>
        </section>
      </main>
    );
  }

  if (stage === "reflection") {
    return (
      <main className="journey-shell">
        <section className="conversation-card reflection-card" aria-labelledby="reflection-title">
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

          <button className="text-button" type="button" onClick={restart}>
            Start a different story
          </button>
        </section>
      </main>
    );
  }

  const prompt = prompts[step];

  return (
    <main className="journey-shell">
      <section className="conversation-card" aria-labelledby="conversation-title">
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
          autoFocus
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
      </section>
    </main>
  );
}
