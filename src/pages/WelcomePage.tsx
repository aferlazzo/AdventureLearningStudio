type WelcomePageProps = {
  onBegin: () => void;
};

export function WelcomePage({ onBegin }: WelcomePageProps) {
  return (
    <main className="welcome-page">
      <section className="welcome-card" aria-labelledby="welcome-title">
        <p className="welcome-brand">Adventure Learning Studio</p>

        <h1 id="welcome-title">Everyone has something worth teaching.</h1>
        <p className="welcome-promise">We'll help you teach it.</p>

        <div className="welcome-divider" aria-hidden="true" />

        <h2>What have you learned in life that could help someone else?</h2>

        <p className="welcome-intro">It could be anything.</p>

        <div className="welcome-examples" aria-label="Examples">
          <span>How to drive confidently.</span>
          <span>How to care for a new puppy.</span>
          <span>How to grow tomatoes.</span>
          <span>How to repair a bicycle.</span>
          <span>How to comfort a frightened child.</span>
          <span>How to start a small business.</span>
        </div>

        <div className="welcome-reassurance">
          <p>You don't need to know how to teach.</p>
          <p>You don't need to know instructional design.</p>
          <p>You only need something you've learned through experience.</p>
        </div>

        <p className="welcome-explanation">
          Adventure Learning Studio will help you transform that experience into
          something others can learn from.
        </p>

        <button className="welcome-button" type="button" onClick={onBegin}>
          Let's Begin
        </button>

        <p className="welcome-note">No teaching experience required.</p>
      </section>
    </main>
  );
}
