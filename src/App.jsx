/**
 * App.jsx
 * Root application shell. Manages page routing and fires GA4 page_view
 * events on every navigation via the useAnalytics hook.
 */

import { useState, useEffect } from 'react';
import Header       from './components/Header.jsx';
import Footer       from './components/Footer.jsx';
import HomePage     from './pages/HomePage.jsx';
import ProcessPage  from './pages/ProcessPage.jsx';
import TypesPage    from './pages/TypesPage.jsx';
import MapPage      from './pages/MapPage.jsx';
import FAQPage      from './pages/FAQPage.jsx';
import ChatPage     from './pages/ChatPage.jsx';
import { useAnalytics } from './hooks/useGoogleServices.js';

/** Human-readable labels used in GA4 page_view reports */
const PAGE_LABELS = {
  home:    'Home',
  process: 'Election Process',
  types:   'Types of Elections',
  map:     'ECI Office Locator',
  faq:     'FAQs',
  chat:    'Ask the Guide',
};

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const { trackPageView } = useAnalytics();

  // Fire a GA4 page_view whenever the user navigates to a new section
  useEffect(() => {
    trackPageView(PAGE_LABELS[activePage] ?? activePage, activePage);
  }, [activePage, trackPageView]);

  /** Navigate to a page and scroll to the top */
  const navigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':    return <HomePage    navigate={navigate} />;
      case 'process': return <ProcessPage navigate={navigate} />;
      case 'types':   return <TypesPage   navigate={navigate} />;
      case 'map':     return <MapPage />;
      case 'faq':     return <FAQPage />;
      case 'chat':    return <ChatPage />;
      default:        return <HomePage    navigate={navigate} />;
    }
  };

  return (
    <div className="app">
      {/* Accessibility: allows keyboard users to jump past navigation */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <Header activePage={activePage} navigate={navigate} />

      <main id="main-content" role="main" tabIndex="-1">
        {renderPage()}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}
