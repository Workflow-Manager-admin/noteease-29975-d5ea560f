import { useState } from 'react';

// PUBLIC_INTERFACE
/**
 * CategoryChips component for filtering notes by category
 * @param {Object} props - Component props
 * @param {Array} props.categories - List of available categories
 * @param {string} props.activeCategory - Currently selected category
 * @param {Function} props.onCategoryChange - Callback when category is selected
 * @param {Function} props.onAddCategory - Callback to add new category
 * @param {Function} props.onRemoveCategory - Callback to remove category
 */
const CategoryChips = ({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  onAddCategory,
  onRemoveCategory 
}) => {
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Handle category selection
  const handleCategoryClick = (category) => {
    onCategoryChange(category === activeCategory ? 'All' : category);
  };

  // Handle adding new category
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
      setShowAddInput(false);
    }
  };

  // Handle removing category
  const handleRemoveCategory = (e, category) => {
    e.stopPropagation();
    if (categories.length > 1) { // Ensure at least one category remains
      onRemoveCategory(category);
      if (activeCategory === category) {
        onCategoryChange('All');
      }
    }
  };

  // Cancel adding new category
  const cancelAddCategory = () => {
    setNewCategory('');
    setShowAddInput(false);
  };

  return (
    <div className="category-chips-container" style={{ marginBottom: '20px' }}>
      <div className="flex flex-wrap gap-2 items-center">
        {/* All categories chip */}
        <button
          className={`category-chip ${activeCategory === 'All' || !activeCategory ? 'active' : ''}`}
          onClick={() => onCategoryChange('All')}
        >
          All
        </button>

        {/* Category chips */}
        {categories.map((category) => (
          <div key={category} className="category-chip-wrapper" style={{ position: 'relative' }}>
            <button
              className={`category-chip ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
              style={{ paddingRight: '32px' }}
            >
              {category}
              {/* Remove button for custom categories (not default ones) */}
              {!['Personal', 'Work', 'Ideas'].includes(category) && (
                <button
                  className="remove-category-btn"
                  onClick={(e) => handleRemoveCategory(e, category)}
                  style={{
                    position: 'absolute',
                    right: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    fontSize: '16px',
                    cursor: 'pointer',
                    padding: '2px',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={`Remove ${category} category`}
                >
                  ×
                </button>
              )}
            </button>
          </div>
        ))}

        {/* Add new category */}
        {showAddInput ? (
          <form onSubmit={handleAddCategory} className="add-category-form">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category name..."
              className="category-input"
              style={{
                padding: '6px 12px',
                border: '2px solid var(--primary)',
                borderRadius: '20px',
                fontSize: '14px',
                minWidth: '120px'
              }}
              autoFocus
              onBlur={() => {
                // Delay to allow form submission
                setTimeout(() => {
                  if (!newCategory.trim()) {
                    cancelAddCategory();
                  }
                }, 100);
              }}
            />
            <button
              type="submit"
              className="btn-add-category"
              style={{
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                fontSize: '16px',
                cursor: 'pointer',
                marginLeft: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              +
            </button>
            <button
              type="button"
              onClick={cancelAddCategory}
              className="btn-cancel-category"
              style={{
                background: 'var(--text-secondary)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                fontSize: '16px',
                cursor: 'pointer',
                marginLeft: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </form>
        ) : (
          <button
            className="category-chip add-category-chip"
            onClick={() => setShowAddInput(true)}
            style={{
              borderStyle: 'dashed',
              color: 'var(--text-secondary)'
            }}
          >
            + Add Category
          </button>
        )}
      </div>

      <style jsx>{`
        .add-category-form {
          display: flex;
          align-items: center;
        }
        
        .category-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        }
        
        .remove-category-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .category-chip.active .remove-category-btn:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
        
        .btn-add-category:hover {
          background-color: #357ABD;
        }
        
        .btn-cancel-category:hover {
          background-color: var(--text-primary);
        }
        
        .add-category-chip:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default CategoryChips;
