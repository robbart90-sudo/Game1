import SegmentedBar from './SegmentedBar';

const HEAT_SEGS = 30; // 30 blocks — each ≈ 3.3% heat; matches timer in speed mode

export default function HeatMeter({ heat, flowState, flowRound }) {
  const isHot  = heat >= 75;
  const count  = Math.round(Math.min(heat, 100) / 100 * HEAT_SEGS);
  const color  = flowState ? 'flow' : isHot ? 'heat-hot' : 'heat';
  const label  = flowState ? `⚡ FLOW STATE — RD ${flowRound}` : '🔥 HEAT';
  const right  = flowState ? 'DRAINING' : `${Math.round(Math.min(heat, 100))}%`;

  return (
    <SegmentedBar
      count={count}
      maxCount={HEAT_SEGS}
      color={color}
      label={label}
      rightLabel={right}
    />
  );
}
