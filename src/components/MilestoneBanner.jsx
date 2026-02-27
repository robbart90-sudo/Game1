import { useEffect, useState } from 'react';
import './MilestoneBanner.css';

export default function MilestoneBanner({ milestone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!milestone) { setVisible(false); return; }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(t);
  }, [milestone]);

  if (!milestone) return null;

  return (
    <div className={`milestone-banner ${visible ? 'show' : 'hide'}`}>
      <span className="milestone-icon">{milestone.emoji}</span>
      <div className="milestone-text">
        <span className="milestone-label">{milestone.label}</span>
        <span className="milestone-sub">{milestone.sub}</span>
      </div>
    </div>
  );
}
