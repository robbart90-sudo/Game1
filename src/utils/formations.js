// ─── Formation Definitions ─────────────────────────────────────────────────────
// Each cell: { x, y, w, h } as fractions of canvas (0..1)
// luckyStyle: how lucky numbers are displayed
//   'row'        – standard horizontal row above grid
//   'split'      – two groups left/right of grid
//   'col-left'   – vertical column on left side
//   'col-right'  – vertical column on right side
//   'scattered'  – irregular positions in header
//   'top-bottom' – split top row + bottom row

export const FORMATIONS = {

  // ── Classic 3×3 ────────────────────────────────────────────────
  classic: {
    id: 'classic',
    cellCount: 9,
    luckyStyle: 'row',
    // evenly spaced 3×3 grid, cells cover most of the scratch zone
    cells: (() => {
      const result = [];
      const cols = 3, rows = 3;
      const pw = 0.28, ph = 0.28;
      const gx = (1 - cols * pw) / (cols + 1);
      const gy = (1 - rows * ph) / (rows + 1);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          result.push({
            x: gx + c * (pw + gx),
            y: gy + r * (ph + gy),
            w: pw,
            h: ph,
          });
        }
      }
      return result;
    })(),
  },

  // ── Wide 5×2 ──────────────────────────────────────────────────
  wide: {
    id: 'wide',
    cellCount: 10,
    luckyStyle: 'top-bottom',
    cells: (() => {
      const result = [];
      const cols = 5, rows = 2;
      const pw = 0.155, ph = 0.36;
      const gx = (1 - cols * pw) / (cols + 1);
      const gy = (1 - rows * ph) / (rows + 1);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          result.push({
            x: gx + c * (pw + gx),
            y: gy + r * (ph + gy),
            w: pw,
            h: ph,
          });
        }
      }
      return result;
    })(),
  },

  // ── Diamond (3-2-3 stagger) ────────────────────────────────────
  diamond: {
    id: 'diamond',
    cellCount: 9,
    luckyStyle: 'split',
    cells: [
      // Row 0 – 3 cells
      { x: 0.06, y: 0.06, w: 0.26, h: 0.28 },
      { x: 0.37, y: 0.06, w: 0.26, h: 0.28 },
      { x: 0.68, y: 0.06, w: 0.26, h: 0.28 },
      // Row 1 – 2 cells offset
      { x: 0.185, y: 0.38, w: 0.26, h: 0.28 },
      { x: 0.555, y: 0.38, w: 0.26, h: 0.28 },
      // Row 2 – 2 cells
      { x: 0.06,  y: 0.68, w: 0.26, h: 0.28 },
      { x: 0.37,  y: 0.68, w: 0.26, h: 0.28 },
      { x: 0.68,  y: 0.68, w: 0.26, h: 0.28 },
      // Center bonus
      { x: 0.37,  y: 0.38, w: 0.26, h: 0.28 },
    ],
  },

  // ── Twin 2×3 Grids ─────────────────────────────────────────────
  twins: {
    id: 'twins',
    cellCount: 12,
    luckyStyle: 'col-left',
    cells: (() => {
      const result = [];
      const pw = 0.2, ph = 0.28;
      // Left cluster (3 cols × 2 rows), starts at x=0.02
      const lx0 = 0.02;
      const rx0 = 0.54;
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
          result.push({ x: lx0 + c * (pw + 0.025), y: 0.08 + r * (ph + 0.1), w: pw, h: ph });
        }
      }
      // Right cluster
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
          result.push({ x: rx0 + c * (pw + 0.025), y: 0.08 + r * (ph + 0.1), w: pw, h: ph });
        }
      }
      return result;
    })(),
  },

  // ── L-Shape ────────────────────────────────────────────────────
  lshape: {
    id: 'lshape',
    cellCount: 8,
    luckyStyle: 'col-right',
    cells: [
      // Vertical bar (3 down)
      { x: 0.06, y: 0.04, w: 0.26, h: 0.28 },
      { x: 0.06, y: 0.36, w: 0.26, h: 0.28 },
      { x: 0.06, y: 0.68, w: 0.26, h: 0.28 },
      // Horizontal bar (3 right of bottom)
      { x: 0.36, y: 0.68, w: 0.26, h: 0.28 },
      { x: 0.66, y: 0.68, w: 0.26, h: 0.28 },
      // Extra cells top-right area
      { x: 0.36, y: 0.04, w: 0.26, h: 0.28 },
      { x: 0.66, y: 0.04, w: 0.26, h: 0.28 },
      { x: 0.66, y: 0.36, w: 0.26, h: 0.28 },
    ],
  },

  // ── Cross / Plus ───────────────────────────────────────────────
  cross: {
    id: 'cross',
    cellCount: 9,
    luckyStyle: 'scattered',
    cells: [
      // Center column
      { x: 0.37, y: 0.04, w: 0.26, h: 0.26 },
      { x: 0.37, y: 0.34, w: 0.26, h: 0.26 },
      { x: 0.37, y: 0.64, w: 0.26, h: 0.26 },
      // Center row
      { x: 0.06, y: 0.34, w: 0.26, h: 0.26 },
      { x: 0.68, y: 0.34, w: 0.26, h: 0.26 },
      // Diagonals
      { x: 0.06, y: 0.04, w: 0.26, h: 0.26 },
      { x: 0.68, y: 0.04, w: 0.26, h: 0.26 },
      { x: 0.06, y: 0.64, w: 0.26, h: 0.26 },
      { x: 0.68, y: 0.64, w: 0.26, h: 0.26 },
    ],
  },

  // ── Single Row × 5 ─────────────────────────────────────────────
  row5: {
    id: 'row5',
    cellCount: 5,
    luckyStyle: 'top-bottom',
    cells: (() => {
      const result = [];
      const pw = 0.155, ph = 0.56;
      const gx = (1 - 5 * pw) / 6;
      for (let c = 0; c < 5; c++) {
        result.push({ x: gx + c * (pw + gx), y: 0.22, w: pw, h: ph });
      }
      return result;
    })(),
  },

  // ── Pyramid 3-2-1 ──────────────────────────────────────────────
  pyramid: {
    id: 'pyramid',
    cellCount: 9,
    luckyStyle: 'row',
    cells: [
      // Base: 4 cells
      { x: 0.03, y: 0.63, w: 0.21, h: 0.30 },
      { x: 0.27, y: 0.63, w: 0.21, h: 0.30 },
      { x: 0.51, y: 0.63, w: 0.21, h: 0.30 },
      { x: 0.75, y: 0.63, w: 0.21, h: 0.30 },
      // Middle: 3 cells
      { x: 0.10, y: 0.32, w: 0.24, h: 0.28 },
      { x: 0.38, y: 0.32, w: 0.24, h: 0.28 },
      { x: 0.66, y: 0.32, w: 0.24, h: 0.28 },
      // Top: 2 cells
      { x: 0.20, y: 0.04, w: 0.26, h: 0.26 },
      { x: 0.54, y: 0.04, w: 0.26, h: 0.26 },
    ],
  },

  // ── 4×3 Grid ──────────────────────────────────────────────────
  grid4x3: {
    id: 'grid4x3',
    cellCount: 12,
    luckyStyle: 'col-right',
    cells: (() => {
      const result = [];
      const cols = 4, rows = 3;
      const pw = 0.205, ph = 0.26;
      const gx = (1 - cols * pw) / (cols + 1);
      const gy = (1 - rows * ph) / (rows + 1);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          result.push({
            x: gx + c * (pw + gx),
            y: gy + r * (ph + gy),
            w: pw,
            h: ph,
          });
        }
      }
      return result;
    })(),
  },
};

// Ordered list for cycling through themes
export const FORMATION_KEYS = Object.keys(FORMATIONS);
