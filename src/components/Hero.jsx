import PropTypes from 'prop-types';

const tspCities = [
  { x: 8, y: 72, label: 'A' },
  { x: 18, y: 34, label: 'B' },
  { x: 28, y: 63, label: 'C' },
  { x: 40, y: 20, label: 'D' },
  { x: 54, y: 48, label: 'E' },
  { x: 67, y: 26, label: 'F' },
  { x: 80, y: 58, label: 'G' },
  { x: 92, y: 37, label: 'H' }
];

const initialTour = [0, 3, 2, 7, 1, 6, 4, 5, 0];
const optimizedTour = [0, 1, 3, 5, 7, 6, 4, 2, 0];

function edgeKey(from, to) {
  return `${Math.min(from, to)}-${Math.max(from, to)}`;
}

function tourToEdges(tour) {
  return tour.slice(0, -1).map((from, index) => {
    const to = tour[index + 1];
    return {
      from,
      to,
      key: edgeKey(from, to)
    };
  });
}

export function Hero({ profile }) {
  const initialEdges = tourToEdges(initialTour);
  const optimizedEdges = tourToEdges(optimizedTour);

  const initialKeys = new Set(initialEdges.map((edge) => edge.key));
  const optimizedKeys = new Set(optimizedEdges.map((edge) => edge.key));

  return (
    <header className="hero js-reveal" id="top">
      <div className="hero-copy">
        <p className="hero-kicker js-stagger">Portfolio / 2026</p>
        <h1 className="hero-title js-stagger">{profile.name}</h1>
        <p className="hero-lede js-stagger">{profile.headline}</p>

        <div className="hero-summary">
          {profile.summary.map((line) => (
            <p key={line} className="js-stagger">
              {line}
            </p>
          ))}
        </div>

        <div className="hero-actions js-stagger">
          <a className="button-link" href={profile.links.cv} target="_blank" rel="noopener noreferrer">
            Download CV
          </a>
          <a className="button-link button-link--ghost" href={profile.links.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>

      <div className="hero-side js-stagger">
        <p className="hero-location">{profile.location}</p>

        <div className="badge-row hero-badges">
          {profile.domains.map((domain) => (
            <span key={domain} className="badge">
              {domain}
            </span>
          ))}
        </div>

        <ul className="metrics-grid">
          {profile.metrics.map((metric) => (
            <li key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </li>
          ))}
        </ul>

        <div className="hero-signal" aria-hidden="true">
          <svg viewBox="0 0 100 80" role="presentation">
            {initialEdges.map((edge, index) => {
              const from = tspCities[edge.from];
              const to = tspCities[edge.to];
              const removed = !optimizedKeys.has(edge.key);
              return (
                <line
                  key={`initial-${edge.key}-${index}`}
                  className={`route-edge route-edge--initial ${removed ? 'route-edge--removed' : 'route-edge--shared'}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                />
              );
            })}

            {optimizedEdges.map((edge, index) => {
              const from = tspCities[edge.from];
              const to = tspCities[edge.to];
              const added = !initialKeys.has(edge.key);
              return (
                <line
                  key={`optimized-${edge.key}-${index}`}
                  className={`route-edge route-edge--optimized ${added ? 'route-edge--added' : 'route-edge--shared'}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                />
              );
            })}

            {tspCities.map((city, index) => (
              <g key={`city-${city.label}`}>
                <circle className={`signal-dot tsp-city city-${index}`} cx={city.x} cy={city.y} r="1.4" />
                <text className="tsp-city-label" x={city.x + 1.9} y={city.y - 1.7}>
                  {city.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </header>
  );
}

Hero.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    headline: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    summary: PropTypes.arrayOf(PropTypes.string).isRequired,
    domains: PropTypes.arrayOf(PropTypes.string).isRequired,
    metrics: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ).isRequired,
    links: PropTypes.shape({
      github: PropTypes.string.isRequired,
      cv: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};
