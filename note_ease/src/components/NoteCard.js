import { getContentSnippet, formatDate } from '../utils/noteUtils';

// PUBLIC_INTERFACE
/**
 * NoteCard component for displaying individual notes
 * @param {Object} props - Component props
 * @param {Object} props.note - The note object
 * @param {Function} props.onClick - Callback when note is clicked
 * @param {Function} props.onDelete - Callback when note is deleted
 */
const NoteCard = ({ note, onClick, onDelete }) => {
  // Handle card click
  const handleCardClick = (e) => {
    // Prevent click when delete button is clicked
    if (e.target.closest('.delete-btn')) {
      return;
    }
    onClick(note);
  };

  // Handle delete with confirmation
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  // Get content snippet for preview
  const contentSnippet = getContentSnippet(note.content, 120);
  
  // Format the date
  const formattedDate = formatDate(note.updatedAt);

  return (
    <div className="note-card" onClick={handleCardClick}>
      {/* Note header with title and delete button */}
      <div className="note-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h3 className="note-title">{note.title}</h3>
        <button
          className="delete-btn"
          onClick={handleDelete}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '4px',
            borderRadius: '4px',
            minWidth: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          title="Delete note"
          aria-label="Delete note"
        >
          🗑️
        </button>
      </div>

      {/* Note content preview */}
      {contentSnippet && (
        <p className="note-content">{contentSnippet}</p>
      )}

      {/* Note metadata */}
      <div className="note-meta">
        <div className="note-info">
          <span className="note-category">{note.category}</span>
        </div>
        <span className="note-date">{formattedDate}</span>
      </div>

      <style jsx>{`
        .delete-btn:hover {
          background-color: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
        }
        
        .note-card:hover .delete-btn {
          opacity: 1;
        }
        
        .delete-btn {
          opacity: 0.6;
          transition: all 0.2s ease;
        }
        
        .note-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .note-date {
          font-size: 11px;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default NoteCard;
