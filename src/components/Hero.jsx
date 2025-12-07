import PropTypes from 'prop-types';

export function Hero({ profile }) {
  return (
    <header className="hero">
      <div>
        <p className="eyebrow">{profile.location}</p>
        <h1>{profile.name}</h1>
        <p className="lede">{profile.headline}</p>
      </div>
      <div className="hero-grid">
        <article className="card">
          <h3>Mission</h3>
          {profile.summary.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </article>
        <article className="card">
          <h3>Signals</h3>
          <div className="badge-row">
            {profile.domains.map((domain) => (
              <span key={domain} className="badge">
                {domain}
              </span>
            ))}
          </div>
        </article>
        <article className="card">
          <h3>Contact</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.6 }}>
            <li>
              <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
            </li>
            <li>
              <a href={`tel:${profile.contact.phone.replace(/\s+/g, '')}`}>{profile.contact.phone}</a>
            </li>
            <li>{profile.contact.address}</li>
          </ul>
          <a className="download" href="/documents/Omkar_Bahiwal_CV.pdf" target="_blank" rel="noopener noreferrer">
            Download CV ↗
          </a>
        </article>
      </div>
    </header>
  );
}

Hero.propTypes = {
  profile: PropTypes.object.isRequired
};
