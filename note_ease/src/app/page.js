'use client';

import { useState, useEffect, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryChips from '../components/CategoryChips';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import FloatingActionButton from '../components/FloatingActionButton';
import {
  loadNotesFromStorage,
  saveNotesToStorage,
  loadCategoriesFromStorage,
  saveCategoriestoStorage,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  filterNotesByCategory,
  sortNotesByDate,
  addCategory,
  removeCategory
} from '../utils/noteUtils';

// PUBLIC_INTERFACE
/**
 * Main NoteEase application component
 */
export default function NoteEase() {
  // State management
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState(['Personal', 'Work', 'Ideas']);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedNotes = loadNotesFromStorage();
    const savedCategories = loadCategoriesFromStorage();
    
    setNotes(savedNotes);
    setCategories(savedCategories);
    setIsLoading(false);
  }, []);

  // Save notes to localStorage when notes change
  useEffect(() => {
    if (!isLoading) {
      saveNotesToStorage(notes);
    }
  }, [notes, isLoading]);

  // Save categories to localStorage when categories change
  useEffect(() => {
    if (!isLoading) {
      saveCategoriestoStorage(categories);
    }
  }, [categories, isLoading]);

  // Filter and sort notes based on search and category
  const filteredNotes = useMemo(() => {
    let filtered = notes;
    
    // Apply search filter
    if (searchTerm) {
      filtered = searchNotes(filtered, searchTerm);
    }
    
    // Apply category filter
    if (activeCategory && activeCategory !== 'All') {
      filtered = filterNotesByCategory(filtered, activeCategory);
    }
    
    // Sort by date (newest first)
    return sortNotesByDate(filtered, false);
  }, [notes, searchTerm, activeCategory]);

  // Handle creating a new note
  const handleCreateNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  // Handle editing an existing note
  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  // Handle saving a note (create or update)
  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        // Update existing note
        const updatedNote = updateNote(editingNote, noteData);
        setNotes(prev => prev.map(note => 
          note.id === editingNote.id ? updatedNote : note
        ));
      } else {
        // Create new note
        const newNote = createNote(noteData.title, noteData.content, noteData.category);
        setNotes(prev => [newNote, ...prev]);
      }
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  };

  // Handle deleting a note
  const handleDeleteNote = (noteId) => {
    setNotes(prev => deleteNote(prev, noteId));
  };

  // Handle search term change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Handle adding new category
  const handleAddCategory = (newCategory) => {
    const updatedCategories = addCategory(categories, newCategory);
    setCategories(updatedCategories);
  };

  // Handle removing category
  const handleRemoveCategory = (categoryToRemove) => {
    const result = removeCategory(categories, notes, categoryToRemove);
    setCategories(result.categories);
    setNotes(result.notes);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: 'var(--text-secondary)'
      }}>
        Loading NoteEase...
      </div>
    );
  }

  return (
    <div className="noteease-app">
      {/* App Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">📝 NoteEase</h1>
          <p className="app-subtitle">Simple & Intuitive Notes</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          {/* Search Bar */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            placeholder="Search your notes..."
          />

          {/* Category Filter Chips */}
          <CategoryChips
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            onAddCategory={handleAddCategory}
            onRemoveCategory={handleRemoveCategory}
          />

          {/* Notes List */}
          <div className="notes-section">
            {filteredNotes.length === 0 ? (
              <div className="empty-state">
                {notes.length === 0 ? (
                  <div className="no-notes">
                    <div className="empty-icon">📝</div>
                    <h3>Welcome to NoteEase!</h3>
                    <p>Start by creating your first note.</p>
                    <button 
                      className="btn btn-primary"
                      onClick={handleCreateNote}
                    >
                      Create Your First Note
                    </button>
                  </div>
                ) : (
                  <div className="no-results">
                    <div className="empty-icon">🔍</div>
                    <h3>No notes found</h3>
                    <p>
                      {searchTerm 
                        ? `No notes match "${searchTerm}"` 
                        : `No notes in "${activeCategory}" category`
                      }
                    </p>
                    {searchTerm && (
                      <button 
                        className="btn btn-secondary"
                        onClick={() => setSearchTerm('')}
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="notes-grid">
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onClick={handleEditNote}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={handleCreateNote}
        title="Create new note"
      />

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        note={editingNote}
        categories={categories}
        onSave={handleSaveNote}
        onClose={handleCloseModal}
      />

      <style jsx>{`
        .noteease-app {
          min-height: 100vh;
          background: var(--background);
        }
        
        .app-header {
          background: var(--secondary);
          border-bottom: 1px solid var(--border-light);
          padding: 20px 0;
          text-align: center;
        }
        
        .header-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .app-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--primary);
          margin: 0;
          margin-bottom: 4px;
        }
        
        .app-subtitle {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0;
        }
        
        .main-content {
          padding: 24px 0;
          flex: 1;
        }
        
        .content-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .notes-section {
          margin-top: 24px;
        }
        
        .notes-grid {
          display: grid;
          gap: 16px;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }
        
        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }
        
        .no-notes h3,
        .no-results h3 {
          font-size: 24px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }
        
        .no-notes p,
        .no-results p {
          font-size: 16px;
          color: var(--text-secondary);
          margin: 0 0 24px 0;
        }
        
        @media (max-width: 768px) {
          .app-title {
            font-size: 28px;
          }
          
          .content-container {
            padding: 0 16px;
          }
          
          .main-content {
            padding: 16px 0;
          }
          
          .empty-state {
            padding: 40px 16px;
          }
          
          .empty-icon {
            font-size: 48px;
          }
        }
      `}</style>
    </div>
  );
}
