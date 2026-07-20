interface ActionCardProps {
  title: string;
  description: string;
  buttonLabel: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export function ActionCard({
  title,
  description,
  buttonLabel,
  onClick,
  disabled = false,
  danger = false
}: ActionCardProps) {
  return (
    <article className="action-card">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <button
        className={danger ? "danger-button" : "secondary-button"}
        onClick={onClick}
        disabled={disabled}
      >
        {buttonLabel}
      </button>
    </article>
  );
}
