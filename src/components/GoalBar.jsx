import './GoalBar.css';

const GOAL = 400; // 2× starting balance
const START = 200;

export default function GoalBar({ balance, achieved }) {
  const pct = Math.min(((balance - START) / (GOAL - START)) * 100, 100);
  const clamped = Math.max(pct, 0);

  return (
    <div className="goal-bar-wrap">
      <div className="goal-bar-label">
        <span>SESSION GOAL</span>
        <span className="goal-target">
          {achieved ? '🏆 ACHIEVED!' : <>{Math.round(clamped)}% · Double to {GOAL}<span className="coin">🪙</span></>}
        </span>
      </div>
      <div className="goal-track">
        <div
          className={`goal-fill ${achieved ? 'done' : ''}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
