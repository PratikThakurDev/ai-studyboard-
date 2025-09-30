import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    axios.get('http://localhost:5000/api/notes', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setNotes(res.data))
    .catch(err => setMessage('Error fetching notes'));
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
    } catch (err) {
      setMessage('Error adding note');
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
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
              <strong>{note.title}</strong>: {note.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
