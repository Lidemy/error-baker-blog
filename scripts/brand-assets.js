"use strict";

/**
 * Regenerates the rasterized brand assets from the toque brand mark:
 *   - img/favicon/favicon-{16,32,192,512}x*.png + apple-touch-icon.png (180px)
 *   - img/ogimage.png (1200×630 social card)
 *
 * The toque geometry mirrors favicon.svg.njk — keep both in sync. Run
 * `node scripts/brand-assets.js` after changing either, then commit the PNGs.
 * (favicon.ico is not regenerated: sharp cannot write ICO and nothing links
 * to it — browsers get the PNG/SVG via <link rel="icon">.)
 */

const path = require("path");
const sharp = require("sharp");

const ACCENT = "#b5322e";
const PAPER = "#fbfaf8";
const INK = "#1f1d1b";
const INK_SOFT = "#4a4642";

const TOQUE = `
  <circle cx="52" cy="84" r="30"/>
  <circle cx="96" cy="64" r="40"/>
  <circle cx="140" cy="84" r="30"/>
  <rect x="56" y="84" width="80" height="58" rx="8"/>
`;

const faviconSvg = `
<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="${ACCENT}"/>
  <g fill="#ffffff">${TOQUE}</g>
</svg>`;

const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="0" y="618" width="1200" height="12" fill="${ACCENT}"/>
  <g transform="translate(140, 175) scale(1.46)">
    <rect width="192" height="192" rx="28" fill="${ACCENT}"/>
    <g fill="#ffffff">${TOQUE}</g>
  </g>
  <g font-family="Georgia, 'Times New Roman', 'Songti TC', 'Noto Serif TC', serif">
    <text x="490" y="315" font-size="96" font-weight="bold" fill="${INK}">ErrorBaker</text>
    <text x="494" y="392" font-size="40" fill="${INK_SOFT}">技術共筆部落格</text>
    <text x="494" y="456" font-size="30" fill="${ACCENT}">錯誤烘焙師，從錯誤中學習</text>
  </g>
</svg>`;

async function main() {
  const faviconDir = path.join(__dirname, "..", "img", "favicon");
  const favicon = Buffer.from(faviconSvg);

  const jobs = [
    ...[16, 32, 192, 512].map((size) =>
      sharp(favicon, { density: 300 })
        .resize(size, size)
        .png()
        .toFile(path.join(faviconDir, `favicon-${size}x${size}.png`))
    ),
    sharp(favicon, { density: 300 })
      .resize(180, 180)
      .png()
      .toFile(path.join(faviconDir, "apple-touch-icon.png")),
    sharp(Buffer.from(ogSvg), { density: 150 })
      .resize(1200, 630)
      .png()
      .toFile(path.join(__dirname, "..", "img", "ogimage.png")),
  ];

  await Promise.all(jobs);
  console.log("brand assets regenerated: favicons + ogimage");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
