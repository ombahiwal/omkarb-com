import PropTypes from 'prop-types';

export function Education({ items }) {
  return (
    <div className="grid-two">
      {items.map((edu) => (
        <article key={edu.title} className="card">
          <div className="timeline-meta">{edu.period}</div>
          <h3>{edu.title}</h3>
          <p style={{ color: 'var(--muted)' }}>{edu.school}</p>
          <ul style={{ margin: '1rem 0 0', paddingLeft: '1rem', color: 'var(--muted)' }}>
            {edu.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

Education.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      school: PropTypes.string.isRequired,
      period: PropTypes.string.isRequired,
      highlights: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ).isRequired
};
