import { Resvg } from '@resvg/resvg-js';
import { profile } from '../../src/data/profile.js';

const WIDTH = 1200;
const HEIGHT = 630;

const escapeXml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const wrapText = (value, maxLength) => {
  const words = value.split(/\s+/);
  const lines = [];

  words.forEach((word) => {
    const current = lines.at(-1);
    if (!current || `${current} ${word}`.length > maxLength) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = `${current} ${word}`;
    }
  });

  return lines;
};

const buildSvg = ({ name, headline, location, summary, domains }, focusIndex = 0) => {
  const safeIndex = Number.isFinite(focusIndex) ? Math.max(0, Math.min(summary.length - 1, focusIndex)) : 0;
  const nameParts = name.split(/\s+/);
  const familyName = escapeXml(nameParts.pop());
  const givenNames = escapeXml(nameParts.join(' '));
  const headlineLines = wrapText(headline, 44).slice(0, 2);
  const heroLines = wrapText(summary[safeIndex], 30).slice(0, 4);
  const domainLines = domains.slice(0, 3).map(escapeXml);

  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f9eadc" />
    <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#050505" stroke-width="2" />
    <path d="M24 106 H1176 M790 106 V606 M24 504 H1176" fill="none" stroke="#050505" stroke-width="2" />
    <rect x="24" y="24" width="82" height="82" fill="#050505" />
    <text x="48" y="76" fill="#f9eadc" font-family="monospace" font-size="23" font-weight="700">OB</text>
    <text x="132" y="72" fill="#050505" font-family="monospace" font-size="20">PORTFOLIO / 2026</text>
    <text x="1148" y="72" fill="#050505" text-anchor="end" font-family="monospace" font-size="20">${escapeXml(location)}</text>
    <text x="62" y="216" fill="#050505" font-family="Arial, sans-serif" font-size="84" font-weight="700">${givenNames.toUpperCase()}</text>
    <text x="62" y="300" fill="#050505" font-family="Arial, sans-serif" font-size="84" font-weight="700">${familyName.toUpperCase()}</text>
    <text x="62" y="388" fill="#050505" font-family="Arial, sans-serif" font-size="28" font-weight="500">
      ${headlineLines.map((line, index) => `<tspan x="62" dy="${index === 0 ? 0 : 34}">${escapeXml(line)}</tspan>`).join('')}
    </text>
    <rect x="790" y="106" width="386" height="398" fill="#f6f6f6" />
    <rect x="824" y="144" width="52" height="52" fill="#00d76f" stroke="#050505" stroke-width="2" />
    <text x="894" y="177" fill="#050505" font-family="monospace" font-size="19">ENGINEERING PROFILE</text>
    <text x="824" y="248" fill="#050505" font-family="Arial, sans-serif" font-size="19">
      ${heroLines.map((line, index) => `<tspan x="824" dy="${index === 0 ? 0 : 25}">${escapeXml(line)}</tspan>`).join('')}
    </text>
    <path d="M824 358 H1142" stroke="#050505" stroke-width="2" />
    <text x="824" y="392" fill="#050505" font-family="monospace" font-size="15">
      ${domainLines.map((line, index) => `<tspan x="824" dy="${index === 0 ? 0 : 22}">${line}</tspan>`).join('')}
    </text>
    <rect x="790" y="504" width="386" height="102" fill="#00d76f" />
    <text x="824" y="565" fill="#050505" font-family="monospace" font-size="26" font-weight="700">OMKARB.COM →</text>
    <text x="62" y="562" fill="#050505" font-family="monospace" font-size="20">FULL-STACK / DATA / IOT</text>
  </svg>`;
};

export const handler = async (event) => {
  try {
    const focusParam = event?.queryStringParameters?.focus ?? '0';
    const focusIndex = Number.parseInt(focusParam, 10);
    const svgMarkup = buildSvg(profile, Number.isNaN(focusIndex) ? 0 : focusIndex);

    const resvg = new Resvg(svgMarkup, {
      background: '#f9eadc',
      fitTo: { mode: 'width', value: WIDTH }
    });
    const pngData = resvg.render().asPng();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      },
      body: Buffer.from(pngData).toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('share-card generation failed', error);
    return {
      statusCode: 500,
      body: 'Unable to generate share card'
    };
  }
};
