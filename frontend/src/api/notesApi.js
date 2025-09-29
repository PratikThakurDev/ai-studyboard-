import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export async function getNotes(userId) {
  const response = await axios.get(`${API_BASE_URL}/notes/${userId}`);
  return response.data;
}

export async function createNote(noteData) {
  const response = await axios.post(`${API_BASE_URL}/notes`, noteData);
  return response.data;
}
