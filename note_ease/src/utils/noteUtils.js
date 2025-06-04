// PUBLIC_INTERFACE
/**
 * Utility functions for note management operations
 */

// Generate unique ID for new notes
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get current timestamp
export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

// Format date for display
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return 'Today';
  } else if (diffDays === 2) {
    return 'Yesterday';
  } else if (diffDays <= 7) {
    return `${diffDays - 1} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// LOCAL STORAGE OPERATIONS

// PUBLIC_INTERFACE
export const saveNotesToStorage = (notes) => {
  try {
    localStorage.setItem('noteease_notes', JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('Error saving notes to storage:', error);
    return false;
  }
};

// PUBLIC_INTERFACE
export const loadNotesFromStorage = () => {
  try {
    const notes = localStorage.getItem('noteease_notes');
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error('Error loading notes from storage:', error);
    return [];
  }
};

// PUBLIC_INTERFACE
export const saveCategoriestoStorage = (categories) => {
  try {
    localStorage.setItem('noteease_categories', JSON.stringify(categories));
    return true;
  } catch (error) {
    console.error('Error saving categories to storage:', error);
    return false;
  }
};

// PUBLIC_INTERFACE
export const loadCategoriesFromStorage = () => {
  try {
    const categories = localStorage.getItem('noteease_categories');
    return categories ? JSON.parse(categories) : ['Personal', 'Work', 'Ideas'];
  } catch (error) {
    console.error('Error loading categories from storage:', error);
    return ['Personal', 'Work', 'Ideas'];
  }
};

// NOTE OPERATIONS

// PUBLIC_INTERFACE
export const createNote = (title, content, category = 'Personal') => {
  const note = {
    id: generateId(),
    title: title.trim(),
    content: content.trim(),
    category: category,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp()
  };
  
  return note;
};

// PUBLIC_INTERFACE
export const updateNote = (note, updates) => {
  return {
    ...note,
    ...updates,
    updatedAt: getCurrentTimestamp()
  };
};

// PUBLIC_INTERFACE
export const deleteNote = (notes, noteId) => {
  return notes.filter(note => note.id !== noteId);
};

// SEARCH AND FILTER OPERATIONS

// PUBLIC_INTERFACE
export const searchNotes = (notes, searchTerm) => {
  if (!searchTerm.trim()) {
    return notes;
  }
  
  const term = searchTerm.toLowerCase();
  return notes.filter(note => 
    note.title.toLowerCase().includes(term) || 
    note.content.toLowerCase().includes(term)
  );
};

// PUBLIC_INTERFACE
export const filterNotesByCategory = (notes, category) => {
  if (!category || category === 'All') {
    return notes;
  }
  
  return notes.filter(note => note.category === category);
};

// PUBLIC_INTERFACE
export const sortNotesByDate = (notes, ascending = false) => {
  return [...notes].sort((a, b) => {
    const dateA = new Date(a.updatedAt);
    const dateB = new Date(b.updatedAt);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Get content snippet for preview
export const getContentSnippet = (content, maxLength = 100) => {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
};

// VALIDATION

// PUBLIC_INTERFACE
export const validateNote = (title, content) => {
  const errors = [];
  
  if (!title.trim()) {
    errors.push('Title is required');
  }
  
  if (title.trim().length > 100) {
    errors.push('Title must be less than 100 characters');
  }
  
  if (!content.trim()) {
    errors.push('Content is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Add new category
export const addCategory = (categories, newCategory) => {
  const category = newCategory.trim();
  if (category && !categories.includes(category)) {
    return [...categories, category];
  }
  return categories;
};

// Remove category (and update notes)
export const removeCategory = (categories, notes, categoryToRemove) => {
  const updatedCategories = categories.filter(cat => cat !== categoryToRemove);
  const updatedNotes = notes.map(note => 
    note.category === categoryToRemove 
      ? { ...note, category: 'Personal' }
      : note
  );
  
  return { categories: updatedCategories, notes: updatedNotes };
};
