import './ModifierTray.css';

export default function ModifierTray({ consecWins, streakMin, brushBoostSecs, slusheeSecs, nextCardWin }) {
  const chips = [];
  if (consecWins >= streakMin) chips.push({ key: 'streak', label: `🔥 x${consecWins}` });
  if (brushBoostSecs > 0)      chips.push({ key: 'brush',  label: `🍟 ${brushBoostSecs}s` });
  if (slusheeSecs > 0)         chips.push({ key: 'frozen', label: `🥤 ${slusheeSecs}s` });
  if (nextCardWin)              chips.push({ key: 'lucky',  label: '⭐ ON' });

  if (!chips.length) return null;

  return (
    <div className="modifier-tray">
      {chips.map(c => (
        <span key={c.key} className="modifier-chip">{c.label}</span>
      ))}
    </div>
  );
}
