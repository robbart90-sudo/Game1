import './SegmentedBar.css';

/**
 * SegmentedBar — reusable discrete-block status bar.
 *
 * Props
 *   count      {number}  how many blocks are lit (left → right)
 *   maxCount   {number}  total blocks in the bar
 *   color      {string}  visual variant: 'timer' | 'timer-urgent' |
 *                        'flow-meter' | 'flow-meter-hot' | 'flow'
 *   label      {string}  left label text
 *   rightLabel {string}  right label text (optional)
 */
export default function SegmentedBar({ count, maxCount, color = 'default', label, rightLabel }) {
  return (
    <div className={`seg-bar seg-bar--${color}`}>
      <div className="seg-bar-row">
        <span className="seg-bar-label">{label}</span>
        {rightLabel != null && <span className="seg-bar-value">{rightLabel}</span>}
      </div>
      <div
        className="seg-bar-track"
        style={{ gridTemplateColumns: `repeat(${maxCount}, 1fr)` }}
      >
        {Array.from({ length: maxCount }, (_, i) => (
          <div key={i} className={`seg-block${i < count ? ' seg-block--on' : ''}`} />
        ))}
      </div>
    </div>
  );
}
