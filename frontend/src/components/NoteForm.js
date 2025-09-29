import React, { useState } from 'react';
import { createNote } from '../api/notesApi';

const NoteForm = ({ userId, onNoteCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newNote = await createNote({ user_id: userId, title, content });
      onNoteCreated(newNote);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Note content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Add Note</button>
    </form>
  );
};

export default NoteForm;
