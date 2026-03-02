import { forwardRef } from 'react';
import ScratchCard from './ScratchCard';

// Thin pass-through — row button logic now lives inside ScratchCard.
// forwardRef so App can call scratchCardRef.current.scratchNextRow() for keyboard shortcuts.
const ScratchToolOverlay = forwardRef(function ScratchToolOverlay({
  cardData,
  onComplete,
  scratchToolUnlocked = false,
  onFirstToolUse,
  ...rest
}, ref) {
  return (
    <ScratchCard
      ref={ref}
      cardData={cardData}
      onComplete={onComplete}
      scratchToolUnlocked={scratchToolUnlocked}
      onFirstToolUse={onFirstToolUse}
      {...rest}
    />
  );
});

export default ScratchToolOverlay;
