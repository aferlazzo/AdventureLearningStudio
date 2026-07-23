import "../styles/welcome.css";

type WelcomePageProps = {
  onBegin: () => void;
};

export function WelcomePage({ onBegin }: WelcomePageProps) {
  return (
    <main className="welcome-page">
      <section className="welcome-card" aria-labelledby="welcome-title">
        <header className="welcome-heading">
          <p className="welcome-brand">Adventure Learning Studio</p>

          <h1 id="welcome-title">Everyone has something worth teaching.</h1>
          <p className="welcome-promise">We'll help you teach it.</p>
        </header>

        <div className="welcome-divider" aria-hidden="true" />

        <div className="welcome-body">
          <h2>What have you learned in life that could help someone else?</h2>

          <p className="welcome-intro">It could be anything.</p>

          <ul className="welcome-examples" aria-label="Examples">
            <li>Drive confidently</li>
            <li>Care for a new puppy</li>
            <li>Grow tomatoes</li>
            <li>Repair a bicycle</li>
            <li>Comfort a frightened child</li>
            <li>Start a small business</li>
          </ul>

          <div className="welcome-reassurance">
            <p>You don't need to know how to teach.</p>
            <p>You don't need to know instructional design.</p>
            <p>You only need something you've learned through experience.</p>
          </div>

          <p className="welcome-explanation">
            Adventure Learning Studio will help you transform that experience into
            something others can learn from.
          </p>
        </div>

        <div className="welcome-action">
          <button className="welcome-button" type="button" onClick={onBegin}>
            Let's Begin
          </button>

          <p className="welcome-note">No teaching experience required.</p>
        </div>
      </section>
    </main>
  );
}
