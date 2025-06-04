import { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
/**
 * SearchBar component for filtering notes
 * @param {Object} props - Component props
 * @param {string} props.searchTerm - Current search term
 * @param {Function} props.onSearchChange - Callback when search term changes
 * @param {string} props.placeholder - Placeholder text for the search input
 */
const SearchBar = ({ searchTerm, onSearchChange, placeholder = "Search notes..." }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');

  // Sync with parent component's search term
  useEffect(() => {
    setLocalSearchTerm(searchTerm || '');
  }, [searchTerm]);

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    // Debounce the search to avoid excessive API calls or filtering
    const timeoutId = setTimeout(() => {
      onSearchChange(value);
    }, 300);

    // Cleanup previous timeout
    return () => clearTimeout(timeoutId);
  };

  // Handle form submission (when user presses Enter)
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchChange(localSearchTerm);
  };

  // Clear search
  const clearSearch = () => {
    setLocalSearchTerm('');
    onSearchChange('');
  };

  return (
    <div className="search-container" style={{ position: 'relative', marginBottom: '20px' }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-bar"
          value={localSearchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          aria-label="Search notes"
        />
        {localSearchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="clear-search-btn"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </form>
      <style jsx>{`
        .search-container {
          position: relative;
        }
        
        .clear-search-btn:hover {
          background-color: var(--border-light);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
