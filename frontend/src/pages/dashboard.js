import NoteList from '../components/NoteList.js';

const Dashboard = () => {
  const userId = 1; // Hardcoded for now or from auth context

  return (
    <div>
      <h1>Dashboard</h1>
      <NoteList userId={userId} />
    </div>
  );
};

export default Dashboard ;