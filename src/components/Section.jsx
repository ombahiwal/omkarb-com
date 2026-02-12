import PropTypes from 'prop-types';

export function Section({ title, meta, index, children, className = '' }) {
  return (
    <section className={`section js-reveal ${className}`.trim()}>
      <header className="section-header">
        {index && <span className="section-index">{index}</span>}
        <h2>{title}</h2>
        {meta && <span className="section-meta">{meta}</span>}
      </header>
      {children}
    </section>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  meta: PropTypes.string,
  index: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
