import ScratchCard from './ScratchCard';

// Thin pass-through — row button logic now lives inside ScratchCard.
export default function ScratchToolOverlay({
  cardData,
  onComplete,
  scratchToolUnlocked = false,
  onFirstToolUse,
  ...rest
}) {
  return (
    <ScratchCard
      cardData={cardData}
      onComplete={onComplete}
      scratchToolUnlocked={scratchToolUnlocked}
      onFirstToolUse={onFirstToolUse}
      {...rest}
    />
  );
}
