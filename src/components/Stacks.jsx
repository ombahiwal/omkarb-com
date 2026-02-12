import PropTypes from 'prop-types';

export function Stacks({ programming, languages }) {
  return (
    <div className="stack-layout">
      <article className="card">
        <h3>Toolchain</h3>
        <p className="card-copy">Languages and runtimes I reach for first when building products end-to-end.</p>
        <div className="badge-row card-badges">
          {programming.map((tech) => (
            <span key={tech} className="badge">
              {tech}
            </span>
          ))}
        </div>
      </article>

      <article className="card">
        <h3>Languages</h3>
        <ul className="language-list">
          {languages.map((lang) => (
            <li key={lang.label}>
              <span>{lang.label}</span>
              <span>{lang.level}</span>
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
