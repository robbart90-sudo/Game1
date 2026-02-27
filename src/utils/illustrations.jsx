// src/utils/illustrations.jsx
// SVG illustration scenes for all 120 lottery ticket themes.
// Architecture: 10 scene templates × 120 compact configs → fully distinct visuals.
//
// Consumers:
//   import { getIllustration } from './illustrations';
//   const layerFn = getIllustration(theme.id);  // returns (props)=>ReactNode or null

export { getIllustration, ILLUSTRATIONS } from './illustrations-configs';
