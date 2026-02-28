import SegmentedBar from './SegmentedBar';
import './FlowMeter.css';

const FLOW_SEGS = 30; // 30 blocks — each ≈ 3.3% of the Flow State meter; matches timer in speed mode

export default function FlowMeter({ flowLevel, flowState, flowRound }) {
  const isHigh  = flowLevel >= 75;
  const count   = Math.round(Math.min(flowLevel, 100) / 100 * FLOW_SEGS);
  const color   = flowState ? 'flow' : isHigh ? 'flow-meter-hot' : 'flow-meter';
  const label   = flowState ? `⚡ FLOW STATE — RD ${flowRound}` : '⚡ FLOW STATE';
  const right   = flowState ? 'DRAINING' : `${Math.round(Math.min(flowLevel, 100))}%`;

  return (
    <SegmentedBar
      count={count}
      maxCount={FLOW_SEGS}
      color={color}
      label={label}
      rightLabel={right}
    />
  );
}
