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

  // ── Trio (1×3) — 3 large cells for $1–3 tickets ────────────────
  trio: {
    id: 'trio',
    cellCount: 3,
    luckyStyle: 'top-bottom',
    cells: (() => {
      const pw = 0.26, ph = 0.60;
      const gx = (1 - 3 * pw) / 4;
      return [0, 1, 2].map(c => ({ x: gx + c * (pw + gx), y: 0.19, w: pw, h: ph }));
    })(),
  },

  // ── Quad (2×2) — 4 cells for $4–7 tickets ─────────────────────
  quad: {
    id: 'quad',
    cellCount: 4,
    luckyStyle: 'row',
    cells: (() => {
      const result = [];
      const cols = 2, rows = 2;
      const pw = 0.40, ph = 0.38;
      const gx = (1 - cols * pw) / (cols + 1);
      const gy = (1 - rows * ph) / (rows + 1);
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          result.push({ x: gx + c * (pw + gx), y: gy + r * (ph + gy), w: pw, h: ph });
      return result;
    })(),
  },

  // ── Hex (3×2) — 6 cells for $8–12 tickets ─────────────────────
  hex: {
    id: 'hex',
    cellCount: 6,
    luckyStyle: 'split',
    cells: (() => {
      const result = [];
      const cols = 3, rows = 2;
      const pw = 0.27, ph = 0.36;
      const gx = (1 - cols * pw) / (cols + 1);
      const gy = (1 - rows * ph) / (rows + 1);
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          result.push({ x: gx + c * (pw + gx), y: gy + r * (ph + gy), w: pw, h: ph });
      return result;
    })(),
  },

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

  // ── Diamond (1-2-3-2-1 true diamond shape) ─────────────────────
  diamond: {
    id: 'diamond',
    cellCount: 9,
    luckyStyle: 'split',
    cells: (() => {
      const pw = 0.26, ph = 0.17;
      const gy = (1 - 5 * ph) / 6; // even vertical gutter (~0.025)
      // 1-2-3-2-1 column counts per row — classic diamond silhouette
      const rowXs = [
        [0.37],
        [0.185, 0.555],
        [0.06,  0.37,  0.68],
        [0.185, 0.555],
        [0.37],
      ];
      return rowXs.flatMap((xs, r) =>
        xs.map(x => ({ x, y: gy + r * (ph + gy), w: pw, h: ph }))
      );
    })(),
  },

  // ── Twin 2×3 Grids ─────────────────────────────────────────────
  twins: {
    id: 'twins',
    cellCount: 12,
    luckyStyle: 'col-left',
    cells: (() => {
      const result = [];
      const pw = 0.14, ph = 0.28;
      const cellGap    = 0.02;  // gap between cells within a cluster
      const clusterGap = 0.04;  // gap between the two clusters
      const lx0 = 0.02;
      // rx0 must start after left cluster's right edge + cluster gap
      // left cluster right edge = lx0 + 3*pw + 2*cellGap = 0.02+0.42+0.04 = 0.48
      const rx0 = lx0 + 3 * pw + 2 * cellGap + clusterGap; // 0.52
      for (let cluster = 0; cluster < 2; cluster++) {
        const x0 = cluster === 0 ? lx0 : rx0;
        for (let r = 0; r < 2; r++) {
          for (let c = 0; c < 3; c++) {
            result.push({ x: x0 + c * (pw + cellGap), y: 0.08 + r * (ph + 0.10), w: pw, h: ph });
          }
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

  // ── 4×2 Grid — minimum 8-cell layout for lowest-price tickets ─
  grid4x2: {
    id: 'grid4x2',
    cellCount: 8,
    luckyStyle: 'row',
    cells: (() => {
      const result = [];
      const cols = 4, rows = 2;
      const pw = 0.20, ph = 0.38;
      const gx = (1 - cols * pw) / (cols + 1);
      const gy = (1 - rows * ph) / (rows + 1);
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          result.push({ x: gx + c * (pw + gx), y: gy + r * (ph + gy), w: pw, h: ph });
      return result;
    })(),
  },

  // ── 4×4 Grid — 16-cell layout for higher-price tickets ────────
  grid4x4: {
    id: 'grid4x4',
    cellCount: 16,
    luckyStyle: 'split',
    cells: (() => {
      const result = [];
      const cols = 4, rows = 4;
      const pw = 0.20, ph = 0.20;
      const gx = (1 - cols * pw) / (cols + 1);
      const gy = (1 - rows * ph) / (rows + 1);
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          result.push({ x: gx + c * (pw + gx), y: gy + r * (ph + gy), w: pw, h: ph });
      return result;
    })(),
  },

  // ── 5×5 Grid — 25-cell layout for maximum-price tickets ───────
  grid5x5: {
    id: 'grid5x5',
    cellCount: 25,
    luckyStyle: 'row',
    cells: (() => {
      const result = [];
      const cols = 5, rows = 5;
      const pw = 0.155, ph = 0.155;
      const gx = (1 - cols * pw) / (cols + 1);
      const gy = (1 - rows * ph) / (rows + 1);
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          result.push({ x: gx + c * (pw + gx), y: gy + r * (ph + gy), w: pw, h: ph });
      return result;
    })(),
  },
};

// Ordered list for cycling through themes
export const FORMATION_KEYS = Object.keys(FORMATIONS);
