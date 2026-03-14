import PropTypes from 'prop-types';

export function Associations({ items }) {
  return (
    <div className="association-list">
      {items.map((assoc) => (
        <article key={assoc.group} className="card">
          {assoc.period && <div className="timeline-meta">{assoc.period}</div>}
          <h3>{assoc.group}</h3>
          <p className="association-role">{assoc.role}</p>
          <p className="card-copy">{assoc.contribution}</p>
        </article>
      ))}
    </div>
  );
}

Associations.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      group: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      period: PropTypes.string,
      contribution: PropTypes.string.isRequired
    })
  ).isRequired
};
