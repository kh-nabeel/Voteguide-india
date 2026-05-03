/**
 * Header.jsx
 * Site header with GoI branding, tricolour accent bar, and primary navigation.
 */


import PropTypes from 'prop-types';

const NAV_ITEMS = [
  { key: 'home',    label: 'Home' },
  { key: 'process', label: 'Election Process' },
  { key: 'types',   label: 'Types of Elections' },
  { key: 'map',     label: 'Office Locator' },
  { key: 'faq',     label: 'FAQs' },
  { key: 'chat',    label: 'Ask the Guide' },
];

/**
 * @param {{ activePage: string, navigate: (page: string) => void }} props
 */
export default function Header({ activePage, navigate }) {
  return (
    <header className="site-header" role="banner">
      {/* Indian tricolour accent */}
      <div className="tricolour" aria-hidden="true">
        <div className="tricolour__saffron" />
        <div className="tricolour__white"   />
        <div className="tricolour__green"   />
      </div>

      {/* Brand row */}
      <div className="header__top">
        <div
          className="header__emblem"
          role="img"
          aria-label="VoteGuide India emblem"
        >
          🗳️
        </div>

        <div className="header__brand">
          <h1>VoteGuide India</h1>
          <p>Indian Election Education Portal — Powered by Google Gemini AI &amp; Google Maps</p>
        </div>

        <div className="header__eci" aria-label="ECI Awareness Initiative">
          ECI<br />Awareness
        </div>
      </div>

      {/* Primary navigation */}
      <nav
        className="site-nav"
        role="navigation"
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map(({ key, label }) => (
          <button
            key={key}
            className={`nav__btn${activePage === key ? ' nav__btn--active' : ''}`}
            onClick={() => navigate(key)}
            aria-current={activePage === key ? 'page' : undefined}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}

Header.propTypes = {
  /** The currently active page key (e.g. 'home', 'map') */
  activePage: PropTypes.string.isRequired,
  /** Callback to navigate to a given page key */
  navigate:   PropTypes.func.isRequired,
};
