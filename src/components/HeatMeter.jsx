import './HeatMeter.css';

export default function HeatMeter({ heat, flowState, flowRound }) {
  const isHot  = heat >= 75;
  const pct    = Math.min(Math.round(heat), 100);

  return (
    <div className={`heat-meter-wrap ${isHot ? 'hot' : ''} ${flowState ? 'flow' : ''}`}>
      <div className="heat-meter-row">
        <span className="heat-label">
          {flowState ? `⚡ FLOW STATE — RD ${flowRound}` : '🔥 HEAT'}
        </span>
        <span className="heat-pct">
          {flowState ? 'DRAINING' : `${pct}%`}
        </span>
      </div>
      <div className="heat-track">
        <div
          className={`heat-fill ${isHot && !flowState ? 'hot-fill' : ''} ${flowState ? 'flow-fill' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
