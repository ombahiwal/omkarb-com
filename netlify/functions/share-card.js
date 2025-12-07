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

const buildSvg = ({ name, headline, location, summary, domains }, focusIndex = 0) => {
  const safeIndex = Number.isFinite(focusIndex) ? Math.max(0, Math.min(summary.length - 1, focusIndex)) : 0;
  const heroLine = escapeXml(summary[safeIndex]);
  const signalLine = escapeXml(domains.slice(0, 3).join(' • '));

  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#040b16" />
        <stop offset="70%" stop-color="#0b1b2c" />
        <stop offset="100%" stop-color="#0f0f23" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" rx="32" fill="url(#bg)" />
    <g fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1">
      ${Array.from({ length: 25 })
        .map((_, idx) => `<path d="M${idx * 48} 0 V ${HEIGHT}" />`)
        .join('')}
    </g>
    <g fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1">
      ${Array.from({ length: 14 })
        .map((_, idx) => `<path d="M0 ${idx * 48} H ${WIDTH}" />`)
        .join('')}
    </g>
    <text x="80" y="160" fill="#6FFFE9" font-family="'JetBrains Mono', 'Space Grotesk', monospace" font-size="28" letter-spacing="8">
      ${escapeXml(location)}
    </text>
    <text x="80" y="250" fill="#FFFFFF" font-family="'Space Grotesk', 'Inter', sans-serif" font-size="72" font-weight="700">
      ${escapeXml(name)}
    </text>
    <text x="80" y="325" fill="#c7d3e1" font-family="'Space Grotesk', sans-serif" font-size="32" font-weight="500">
      ${escapeXml(headline)}
    </text>
    <text x="80" y="410" fill="#94a6c4" font-family="'Space Grotesk', sans-serif" font-size="30" font-weight="400">
      ${heroLine}
    </text>
    <text x="80" y="475" fill="#6FFFE9" font-family="'JetBrains Mono', monospace" font-size="26">
      ${signalLine}
    </text>
    <rect x="80" y="510" width="380" height="72" rx="36" fill="rgba(111,255,233,0.08)" stroke="#6FFFE9" />
    <text x="120" y="557" fill="#6FFFE9" font-family="'JetBrains Mono', monospace" font-size="26">omkarb.com</text>
  </svg>`;
};

export const handler = async (event) => {
  try {
    const focusParam = event?.queryStringParameters?.focus ?? '0';
    const focusIndex = Number.parseInt(focusParam, 10);
    const svgMarkup = buildSvg(profile, Number.isNaN(focusIndex) ? 0 : focusIndex);

    const resvg = new Resvg(svgMarkup, {
      background: '#05070f',
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
