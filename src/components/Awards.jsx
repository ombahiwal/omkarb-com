import PropTypes from 'prop-types';

export function Awards({ items }) {
  return (
    <div className="awards-list">
      {items.map((award) => (
        <article key={award.title} className="card">
          <div className="timeline-meta">{award.year}</div>
          <h3>{award.title}</h3>
          <p style={{ color: 'var(--muted)' }}>{award.org}</p>
        </article>
      ))}
    </div>
  );
}

Awards.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      org: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired
    })
  ).isRequired
};
