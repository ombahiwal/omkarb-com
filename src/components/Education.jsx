import PropTypes from 'prop-types';

export function Education({ items }) {
  return (
    <div className="education-layout">
      {items.map((edu) => (
        <article key={edu.title} className="card">
          <div className="timeline-meta">{edu.period}</div>
          <h3>{edu.title}</h3>
          <p className="card-copy">{edu.school}</p>
          <ul className="education-list">
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
