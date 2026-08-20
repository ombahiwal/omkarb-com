import PropTypes from 'prop-types';

export function Footer({ profile }) {
  return (
    <footer className="footer" id="contact">
      <h2 className="footer-title">Let&rsquo;s make something clear.</h2>

      <div className="linked-search">
        <span className="search-cursor" aria-hidden="true" />
        <a className="list-node" href={profile.links.email}>
          Email
        </a>
        <span className="list-arrow" aria-hidden="true">
          →
        </span>
        <a className="list-node" href={profile.links.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <span className="list-arrow" aria-hidden="true">
          →
        </span>
        <a className="list-node" href={profile.links.cv} target="_blank" rel="noopener noreferrer" download>
          CV
        </a>
        <span className="list-arrow" aria-hidden="true">
          →
        </span>
        <a className="list-node" href="#top">
          Me
        </a>
      </div>

      <div className="footer-meta">
        <span>© {new Date().getFullYear()} Omkar Bahiwal</span>
        <span>Portfolio</span>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  profile: PropTypes.shape({
    links: PropTypes.shape({
      github: PropTypes.string.isRequired,
      cv: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};
