import PropTypes from 'prop-types';

export function Stacks({ programming, languages }) {
  return (
    <div className="grid-two">
      <article className="card">
        <h3>Toolchain</h3>
        <p style={{ color: 'var(--muted)', marginTop: '0.4rem' }}>The languages and runtimes I reach for first.</p>
        <div className="badge-row" style={{ marginTop: '1rem' }}>
          {programming.map((tech) => (
            <span key={tech} className="badge">
              {tech}
            </span>
          ))}
        </div>
      </article>
      <article className="card">
        <h3>Languages</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0.8rem 0 0', display: 'grid', gap: '0.6rem' }}>
          {languages.map((lang) => (
            <li key={lang.label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace' }}>
              <span>{lang.label}</span>
              <span style={{ color: 'var(--muted)' }}>{lang.level}</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

Stacks.propTypes = {
  programming: PropTypes.arrayOf(PropTypes.string).isRequired,
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired
    })
  ).isRequired
};
