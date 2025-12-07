import PropTypes from 'prop-types';

export function Timeline({ items }) {
  return (
    <div className="timeline">
      {items.map((item) => (
        <article key={`${item.role}-${item.company}`} className="timeline-item">
          <div>
            <div className="timeline-meta">{item.period}</div>
            <div className="timeline-meta">{item.location}</div>
          </div>
          <div>
            <h3>
              {item.role} · {item.company}
            </h3>
            <p>{item.impact}</p>
            <div className="badge-row" style={{ marginTop: '0.8rem' }}>
              {item.keywords.map((keyword) => (
                <span key={keyword} className="badge">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

Timeline.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      period: PropTypes.string.isRequired,
      keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
      impact: PropTypes.string.isRequired
    })
  ).isRequired
};
