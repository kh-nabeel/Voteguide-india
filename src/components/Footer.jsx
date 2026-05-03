/**
 * Footer.jsx
 * Site footer with quick links, contact info, and legal disclaimer.
 */

import PropTypes from 'prop-types';

/** @param {{ navigate: (page: string) => void }} props */
export default function Footer({ navigate }) {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer__grid">

        {/* Brand */}
        <div className="footer__brand">
          <h3>🗳️ VoteGuide India</h3>
          <p>
            An AI-powered election education portal built for the Google India
            PromptWars Virtual Hackathon. Helping every Indian citizen understand
            the world&apos;s largest democratic process.
          </p>
          <p style={{ marginTop: '12px', fontSize: '12px', opacity: 0.75 }}>
            Powered by Google Gemini AI · Google Maps · Google Analytics ·
            Google Cloud Run
          </p>
        </div>

        {/* Explore */}
        <div className="footer__col">
          <h4>Explore</h4>
          <ul>
            <li><button onClick={() => navigate('process')} style={linkStyle}>Election Process</button></li>
            <li><button onClick={() => navigate('types')}   style={linkStyle}>Types of Elections</button></li>
            <li><button onClick={() => navigate('map')}     style={linkStyle}>ECI Office Locator</button></li>
            <li><button onClick={() => navigate('faq')}     style={linkStyle}>FAQs</button></li>
            <li><button onClick={() => navigate('chat')}    style={linkStyle}>Ask the Guide</button></li>
          </ul>
        </div>

        {/* Official links & helpline */}
        <div className="footer__col">
          <h4>Official Resources</h4>
          <ul>
            <li><a href="https://www.eci.gov.in"     target="_blank" rel="noopener noreferrer">Election Commission of India</a></li>
            <li><a href="https://voters.eci.gov.in"  target="_blank" rel="noopener noreferrer">Voter Registration Portal</a></li>
            <li><a href="https://nvsp.in"            target="_blank" rel="noopener noreferrer">National Voter Service Portal</a></li>
            <li><a href="tel:1950" style={{ color: '#6AD4A0' }}>📞 Helpline: 1950 (Free)</a></li>
          </ul>
        </div>

      </div>

      <div className="footer__bottom">
        <p>
          This is an independent educational awareness portal. For official and
          legally binding information, please visit{' '}
          <a href="https://www.eci.gov.in" target="_blank" rel="noopener noreferrer">
            www.eci.gov.in
          </a>
          . Built with ❤️ for India&apos;s Democracy.
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  navigate: PropTypes.func.isRequired,
};

// Inline style for footer nav buttons (resets button to look like a link)
const linkStyle = {
  background: 'none', border: 'none', padding: 0,
  color: '#B8CCE4', textDecoration: 'none',
  fontSize: '14px', cursor: 'pointer', textAlign: 'left',
  fontFamily: 'inherit',
};
