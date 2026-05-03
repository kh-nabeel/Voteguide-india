import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MapPage from '../../pages/MapPage';

// Mock the child components
vi.mock('../../components/FeedbackWidget.jsx', () => ({
  default: () => <div data-testid="feedback-widget">FeedbackWidget Mock</div>,
}));

// Mock the analytics hook
const mockTrackEvent = vi.fn();
vi.mock('../../hooks/useGoogleServices.js', () => ({
  useAnalytics: () => ({ trackEvent: mockTrackEvent }),
}));

describe('MapPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup global Google Maps mock
    window.google = {
      maps: {
        Map: vi.fn().mockImplementation(function() {
          this.setZoom = vi.fn();
          this.panTo = vi.fn();
        }),
        Marker: vi.fn().mockImplementation(function() {
          this.addListener = vi.fn();
        }),
        InfoWindow: vi.fn().mockImplementation(function() {
          this.setContent = vi.fn();
          this.open = vi.fn();
          this.close = vi.fn();
        }),
        ControlPosition: {
          RIGHT_CENTER: 1,
        },
        SymbolPath: {
          CIRCLE: 0,
        },
        event: {
          trigger: vi.fn(),
        },
      },
    };

    // Simulate the script loading mechanism by manually calling initMap if defined
    // Wait, MapPage adds a script tag and sets window.initMap. 
    // We can intercept the script tag append to simulate load.
    const originalAppendChild = document.head.appendChild;
    vi.spyOn(document.head, 'appendChild').mockImplementation((element) => {
      if (element.tagName === 'SCRIPT' && element.src.includes('maps.googleapis.com')) {
        setTimeout(() => {
          if (typeof window.initGoogleMapCallback === 'function') {
            window.initGoogleMapCallback();
          }
        }, 10);
      }
      return originalAppendChild.call(document.head, element);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete window.google;
    delete window.initGoogleMapCallback;
    // Remove injected scripts to avoid cross-test pollution
    document.querySelectorAll('script').forEach(s => s.remove());
  });

  it('renders the map layout and sidebar', async () => {
    render(<MapPage />);

    expect(screen.getByRole('heading', { name: /ECI Office Locator/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search state or city/i)).toBeInTheDocument();
    
    // Check if some states are loaded in the sidebar
    expect(screen.getAllByText(/Andhra Pradesh/i)[0]).toBeInTheDocument();
  });

  it('filters offices based on search input', async () => {
    render(<MapPage />);
    const searchInput = screen.getByPlaceholderText(/Search state or city/i);

    fireEvent.change(searchInput, { target: { value: 'Delhi' } });

    // Should show Delhi, hide Andhra Pradesh
    expect(screen.getAllByText(/Delhi \(NCT\)/i)[0]).toBeInTheDocument();
    expect(screen.queryByText(/Andhra Pradesh/i)).not.toBeInTheDocument();
  });

  it('selects an office when clicked in the sidebar', async () => {
    render(<MapPage />);
    const officeItem = screen.getAllByText(/Andhra Pradesh/i)[0];

    fireEvent.click(officeItem);

    // After click, the reset button should appear and map should be manipulated
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Show All India/i })).toBeInTheDocument();
    });

    // Verify analytics was called
    expect(mockTrackEvent).toHaveBeenCalledWith('office_selected', { state: 'Andhra Pradesh' });
  });

  it('handles map initialization', async () => {
    render(<MapPage />);
    
    await waitFor(() => {
      expect(window.google.maps.Map).toHaveBeenCalled();
    });
  });

  it('handles Google Maps load failure gracefully by showing fallback', async () => {
    // Force MapPage to re-load the script by clearing mocks
    document.querySelectorAll('script').forEach(s => s.remove());
    delete window.google;

    // Override the global setup to specifically fail
    vi.spyOn(document.head, 'appendChild').mockImplementation((element) => {
      if (element.tagName === 'SCRIPT' && element.src.includes('maps.googleapis.com')) {
        setTimeout(() => {
          if (element.onerror) {
            element.onerror(new Event('error'));
          }
        }, 10);
      }
      return element; // do not actually append it to avoid side effects
    });

    render(<MapPage />);

    await waitFor(() => {
      const fallbackIframe = screen.queryByTitle(/ECI Office Location/i);
      const noKeyPlaceholder = screen.queryByText(/Google Maps Not Configured/i);
      expect(fallbackIframe || noKeyPlaceholder).toBeTruthy();
    });
  });
});
