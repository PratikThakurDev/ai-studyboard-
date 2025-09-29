import React, { useState } from 'react';
import NoteForm from '../components/NoteForm.js';
import NoteList from '../components/NoteList.js';

const Dashboard = () => {
  const userId = 1; // Hardcoded for now
  const [refresh, setRefresh] = useState(false);

  const handleNoteCreated = () => {
    setRefresh(!refresh);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <NoteForm userId={userId} onNoteCreated={handleNoteCreated} />
      <NoteList userId={userId} key={refresh} />
    </div>
  );
};

export default Dashboard;
