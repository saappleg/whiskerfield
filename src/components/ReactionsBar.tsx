import { REACTIONS, type ReactionCounts, type ReactionType } from '../types/community';

type ReactionsBarProps = {
  reactions?: ReactionCounts;
  userReaction?: ReactionType;
  onReact: (reaction: ReactionType) => void;
  compact?: boolean;
};

export function ReactionsBar({ reactions = {}, userReaction, onReact, compact = false }: ReactionsBarProps) {
  return (
    <div className={`reactions-bar ${compact ? 'compact' : ''}`} aria-label="Cat reactions">
      {REACTIONS.map(({ key, label, emoji }) => {
        const count = reactions[key] ?? 0;
        const isActive = userReaction === key;

        return (
          <button
            key={key}
            type="button"
            className={`reaction-pill ${isActive ? 'active' : ''} ${key}`}
            onClick={() => onReact(key)}
            title={`${label}${count > 0 ? ` (${count})` : ''}`}
            aria-pressed={isActive}
          >
            <span className="reaction-emoji" aria-hidden="true">
              {emoji}
            </span>
            <span className="reaction-label">{label}</span>
            {count > 0 && <span className="reaction-count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
