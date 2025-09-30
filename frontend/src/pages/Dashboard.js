import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [editNoteId, setEditNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    axios.get('http://localhost:5000/api/notes', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setNotes(res.data))
    .catch(() => setMessage('Error fetching notes'));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setMessage('Title and content are required');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/notes', { title, content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes([res.data, ...notes]);
      setTitle('');
      setContent('');
      setMessage('Note added successfully');
    } catch {
      setMessage('Error adding note');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const startEdit = (note) => {
    setEditNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setMessage('');
  };

  const cancelEdit = () => {
    setEditNoteId(null);
    setEditTitle('');
    setEditContent('');
    setMessage('');
  };

  const saveEdit = async (noteId) => {
    if (!editTitle || !editContent) {
      setMessage('Title and content are required');
      return;
    }
    try {
      const res = await axios.put(`http://localhost:5000/api/notes/${noteId}`, 
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes(notes.map(note => (note.id === noteId ? res.data : note)));
      setEditNoteId(null);
      setEditTitle('');
      setEditContent('');
      setMessage('Note updated successfully');
    } catch {
      setMessage('Error updating note');
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Add Note</button>
      </form>

      <h3>Your Notes</h3>
      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <ul>
          {notes.map(note => (
            <li key={note.id}>
              {editNoteId === note.id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    required
                  />
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    required
                  />
                  <button onClick={() => saveEdit(note.id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <strong>{note.title}</strong>: {note.content}
                  <button onClick={() => startEdit(note)}>Edit</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
