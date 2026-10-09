// ============================================
// STUDENT API — all backend calls in one place
// ============================================

// Import axios — library to make HTTP requests
import axios from 'axios';

// Base URL of our backend server (from Step 3-5)
// All requests will start with this
const BASE_URL = 'http://localhost:5000';

// --------------------------------------------
// Create a custom axios instance
// --------------------------------------------
// So we don't repeat BASE_URL in every call
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',  // tell server we're sending JSON
  },
});

// --------------------------------------------
// API FUNCTIONS — one per backend route
// --------------------------------------------

// Get ALL students  →  GET /students
export const getAllStudents = async () => {
  const response = await api.get('/students');
  return response.data;  // axios wraps response in .data
};

// Get ONE student  →  GET /students/:id
export const getStudentById = async (id) => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};

// ADD a new student  →  POST /students
export const addStudent = async (studentData) => {
  const response = await api.post('/students', studentData);
  return response.data;
};

// UPDATE a student  →  PUT /students/:id
export const updateStudent = async (id, studentData) => {
  const response = await api.put(`/students/${id}`, studentData);
  return response.data;
};

// DELETE a student  →  DELETE /students/:id
export const deleteStudent = async (id) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};