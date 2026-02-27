import { useEffect, useState } from 'react';
import './Sparkles.css';

const COUNT = 14;

export default function Sparkles({ active }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) { setParticles([]); return; }
    setParticles(
      Array.from({ length: COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 4 + Math.random() * 7,
        delay: Math.random() * 0.4,
        dur: 0.5 + Math.random() * 0.5,
      }))
    );
    const t = setTimeout(() => setParticles([]), 1200);
    return () => clearTimeout(t);
  }, [active]);

  if (!particles.length) return null;
  return (
    <div className="sparkles-overlay" aria-hidden>
      {particles.map(p => (
        <div
          key={p.id}
          className="spark"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
