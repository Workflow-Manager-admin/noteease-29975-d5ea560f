import { useState, useEffect } from 'react';
import { validateNote } from '../utils/noteUtils';

// PUBLIC_INTERFACE
/**
 * NoteModal component for creating and editing notes
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Object} props.note - The note being edited (null for new note)
 * @param {Array} props.categories - Available categories
 * @param {Function} props.onSave - Callback when note is saved
 * @param {Function} props.onClose - Callback when modal is closed
 */
const NoteModal = ({ isOpen, note, categories, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Personal');
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when modal opens or note changes
  useEffect(() => {
    if (isOpen) {
      if (note) {
        // Editing existing note
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category);
      } else {
        // Creating new note
        setTitle('');
        setContent('');
        setCategory('Personal');
      }
      setErrors([]);
    }
  }, [isOpen, note]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form data
    const validation = validateNote(title, content);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Create note data
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        category: category
      };
      
      // Call save callback
      await onSave(noteData);
      
      // Close modal on success
      handleClose();
    } catch (error) {
      console.error('Error saving note:', error);
      setErrors(['Failed to save note. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      setContent('');
      setCategory('Personal');
      setErrors([]);
      onClose();
    }
  };

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {note ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="error-messages" style={{ 
            background: '#fee', 
            border: '1px solid #fcc', 
            borderRadius: '4px', 
            padding: '12px', 
            marginBottom: '16px' 
          }}>
            {errors.map((error, index) => (
              <div key={index} style={{ color: '#c33', fontSize: '14px' }}>
                {error}
              </div>
            ))}
          </div>
        )}

        {/* Note Form */}
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="form-group">
            <label htmlFor="note-title" className="form-label">
              Title *
            </label>
            <input
              id="note-title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              maxLength={100}
              disabled={isSubmitting}
              required
            />
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'right', marginTop: '4px' }}>
              {title.length}/100
            </div>
          </div>

          {/* Category Selection */}
          <div className="form-group">
            <label htmlFor="note-category" className="form-label">
              Category
            </label>
            <select
              id="note-category"
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Content Textarea */}
          <div className="form-group">
            <label htmlFor="note-content" className="form-label">
              Content *
            </label>
            <textarea
              id="note-content"
              className="form-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note content here..."
              rows={8}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (note ? 'Update Note' : 'Create Note')}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .error-messages {
          animation: slideDown 0.3s ease-out;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal-content {
          animation: modalAppear 0.3s ease-out;
        }
        
        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .form-input:disabled,
        .form-textarea:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default NoteModal;
