import PropTypes from 'prop-types';

export function Section({ title, meta, index, id, children, className = '' }) {
  return (
    <section className={`section js-reveal ${className}`.trim()} id={id}>
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
  id: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
