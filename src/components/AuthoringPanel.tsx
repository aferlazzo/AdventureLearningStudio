import { useMemo, useState } from "react";
import type { AdventureSectionKey } from "../models/adventure";

interface AuthoringPanelProps {
  section: AdventureSectionKey;
  savedAnswers: string[];
  onSaveAnswer: (answers: string[]) => void;
  onComplete: (answers: string[]) => void;
  onExit: () => void;
}

const sectionTitles: Record<AdventureSectionKey, string> = {
  situation: "Situation",
  anxiety: "Anxiety",
  decision: "Decision",
  experience: "Experience",
  consequences: "Consequences",
  capability: "Capability"
};

const prompts: Record<AdventureSectionKey, string[]> = {
  situation: [
    "Describe the real-world situation the learner may face.",
    "What makes this situation important enough to teach?",
    "What should the learner notice first?"
  ],
  anxiety: [
    "What is the learner likely to worry about in this situation?",
    "What mistake might anxiety cause?",
    "What would help the learner remain calm?"
  ],
  decision: [
    "What decision must the learner make?",
    "What information should guide that decision?",
    "What is the safest default choice?"
  ],
  experience: [
    "Describe a real example of encountering this situation.",
    "What did the experienced person notice before taking action?",
    "What reasoning led to the safest response?"
  ],
  consequences: [
    "What can happen when the situation is handled well?",
    "What can happen when it is handled poorly?",
    "Which consequence matters most to the learner?"
  ],
  capability: [
    "What should the learner be able to do after completing this Adventure?",
    "How will the learner know they are ready?",
    "What final confidence-building reminder should they remember?"
  ]
};

export function AuthoringPanel({
  section,
  savedAnswers,
  onSaveAnswer,
  onComplete,
  onExit
}: AuthoringPanelProps) {
  const questions = prompts[section];
  const [answers, setAnswers] = useState<string[]>(() =>
    questions.map((_, index) => savedAnswers[index] ?? "")
  );
  const [step, setStep] = useState(() => {
    const firstEmpty = answers.findIndex((answer) => !answer.trim());
    return firstEmpty === -1 ? questions.length - 1 : firstEmpty;
  });

  const answer = answers[step] ?? "";
  const isLast = step === questions.length - 1;
  const canContinue = answer.trim().length >= 3;

  const progressText = useMemo(
    () => `Question ${step + 1} of ${questions.length}`,
    [step, questions.length]
  );

  function updateAnswer(value: string) {
    const next = [...answers];
    next[step] = value;
    setAnswers(next);
    onSaveAnswer(next);
  }

  function continueForward() {
    if (!canContinue) return;
    if (isLast) {
      onComplete(answers);
      return;
    }
    setStep(step + 1);
  }

  return (
    <section className="panel authoring-panel">
      <div className="authoring-topline">
        <div>
          <p className="eyebrow">Authoring mode</p>
          <h2>{sectionTitles[section]}</h2>
        </div>
        <button className="link-button" onClick={onExit}>Save and exit</button>
      </div>

      <div className="question-progress">
        <span>{progressText}</span>
        <div className="mini-progress">
          <div style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <label className="conversation-question" htmlFor="author-answer">
        {questions[step]}
      </label>

      <textarea
        id="author-answer"
        autoFocus
        value={answer}
        onChange={(event) => updateAnswer(event.target.value)}
        placeholder="Write naturally. You can refine it later."
        rows={8}
      />

      <div className="authoring-actions">
        <button
          className="secondary-button"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Back
        </button>
        <button
          className="primary-button"
          onClick={continueForward}
          disabled={!canContinue}
        >
          {isLast ? `Complete ${sectionTitles[section]}` : "Next"}
        </button>
      </div>

      <p className="autosave-note">Answers are saved automatically in this browser.</p>
    </section>
  );
}
