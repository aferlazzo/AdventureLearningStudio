import { APP_VERSION } from "../version";

interface AppHeaderProps {
  subtitle?: string;
  onHome?: () => void;
}

export function AppHeader({ subtitle, onHome }: AppHeaderProps) {
  return (
    <header
      className="app-header"
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px" }}
    >
      <button className="brand-button" onClick={onHome} aria-label="Go to Adventure Library">
        <span className="brand-title">Adventure Learning Studio</span>
        <span className="brand-subtitle">{subtitle ?? "Build confidence through experience"}</span>
      </button>
      <span
        className="app-version"
        style={{ color: "#c7d0dc", fontFamily: "monospace", fontSize: "0.9rem", whiteSpace: "nowrap" }}
      >
        v{APP_VERSION}
      </span>
    </header>
  );
}
