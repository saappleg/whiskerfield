import { weeklyPrompt } from '../data/editorial';

export function PromptCard() {
  return (
    <aside className="prompt-card">
      <div className="prompt-tag">
        <span className="prompt-spark" aria-hidden="true">✦</span>
        <span>{weeklyPrompt.label}</span>
      </div>
      <h3>{weeklyPrompt.title}</h3>
      <p className="prompt-detail">{weeklyPrompt.detail}</p>
      <a className="prompt-link" href="#community">Share your cat’s answer ↓</a>
    </aside>
  );
}
