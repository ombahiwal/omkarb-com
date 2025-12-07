import PropTypes from 'prop-types';

export function Section({ title, meta, children }) {
  return (
    <section className="section">
      <header className="section-header">
        <h2>{title}</h2>
        {meta && <span>{meta}</span>}
      </header>
      {children}
    </section>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  meta: PropTypes.string,
  children: PropTypes.node.isRequired
};
