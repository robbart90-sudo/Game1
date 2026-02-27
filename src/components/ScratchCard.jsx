import ScratchCell from './ScratchCell';
import './ScratchCard.css';

export default function ScratchCard({ cardData, onCellScratched, onRevealAll }) {
  const { theme, luckyNumbers, cells } = cardData;
  const { palette } = theme;

  const hdBg = `linear-gradient(135deg, ${palette.hdr[0]}, ${palette.hdr[1]}, ${palette.hdr[2]})`;
  const cardBg = `linear-gradient(170deg, ${palette.bg[0]}, ${palette.bg[1]})`;

  const scratchedCount = cells.filter(c => c.scratched).length;
  const allScratched   = scratchedCount === cells.length;
  const showRevealBtn  = scratchedCount > 0 && !allScratched;

  return (
    <div className="ticket" style={{ background: cardBg, borderColor: palette.border }}>

      {/* Holographic sheen */}
      <div className="ticket-sheen" />

      {/* ── Header ───────────────────────────── */}
      <div className="ticket-header" style={{ background: hdBg }}>
        <div className="ticket-price-badge">{theme.price}🪙</div>
        <div className="ticket-title-block">
          <span className="ticket-emoji">{theme.emoji}</span>
          <span className="ticket-name">{theme.name}</span>
        </div>
        <div className="ticket-top-prize">TOP PRIZE: {theme.topPrize}</div>
      </div>

      {/* ── Lucky Numbers ────────────────────── */}
      <div className="ticket-section" style={{ borderColor: `${palette.border}55` }}>
        <div className="section-label" style={{ color: palette.accent }}>LUCKY NUMBERS</div>
        <div className="lucky-row">
          {luckyNumbers.map((n, i) => (
            <div
              key={i}
              className="lucky-num"
              style={{
                background: palette.numBg,
                color: palette.numText,
                borderColor: palette.border,
              }}
            >
              {String(n).padStart(2, '0')}
            </div>
          ))}
        </div>
      </div>

      {/* ── Your Numbers ─────────────────────── */}
      <div className="ticket-section" style={{ borderColor: `${palette.border}55` }}>
        <div className="section-label" style={{ color: palette.accent }}>YOUR NUMBERS</div>
        <div className="cells-grid">
          {cells.map((cell, i) => (
            <ScratchCell
              key={i}
              index={i}
              cell={cell}
              palette={palette}
              onScratched={onCellScratched}
            />
          ))}
        </div>
      </div>

      {/* ── Footer / Tagline ─────────────────── */}
      <div className="ticket-footer" style={{ background: hdBg }}>
        {showRevealBtn ? (
          <button className="reveal-all-btn" onClick={onRevealAll}>
            ⚡ Reveal All
          </button>
        ) : (
          <span className="ticket-tagline">{theme.tagline}</span>
        )}
      </div>
    </div>
  );
}
