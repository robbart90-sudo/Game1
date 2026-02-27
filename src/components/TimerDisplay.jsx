import './TimerDisplay.css';

export default function TimerDisplay({ timeLeft, active, speedMode }) {
  const urgent = timeLeft <= 10 && active;
  const pct = active ? (timeLeft / (speedMode ? 30 : 60)) * 100 : 100;

  const mm = String(Math.floor(timeLeft / 60)).padStart(1, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className={`timer-wrap ${urgent ? 'urgent' : ''} ${!active ? 'inactive' : ''}`}>
      <div className="timer-ring">
        <svg viewBox="0 0 40 40" className="timer-svg">
          <circle cx="20" cy="20" r="17" className="timer-track" />
          <circle
            cx="20" cy="20" r="17"
            className="timer-arc"
            style={{
              strokeDashoffset: `${(1 - pct / 100) * 2 * Math.PI * 17}`,
              stroke: urgent ? '#ff3355' : '#D4AF37',
            }}
          />
        </svg>
        <div className="timer-digits">
          {mm}:{ss}
        </div>
      </div>
      {speedMode && <span className="speed-badge">⚡ SPEED</span>}
    </div>
  );
}
