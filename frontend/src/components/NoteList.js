import React, { useEffect, useState } from 'react';
import { getNotes } from '../api/notesApi';

const NoteList = ({ userId }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const data = await getNotes(userId);
        setNotes(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    }
    fetchNotes();
  }, [userId]);

  return (
    <div>
      <h2>User Notes</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong><br />
            {note.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoteList;
