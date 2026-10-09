// ============================================
// HOME PAGE — Beautiful UI with stats + form + table
// ============================================

import { useState, useEffect } from 'react';
import StudentForm from '../components/StudentForm';
import StudentTable from '../components/StudentTable';
import { getAllStudents, deleteStudent } from '../api/studentApi';

function Home() {
  // --------------------------------------------
  // STATE
  // --------------------------------------------
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------
  // FETCH all students on load
  // --------------------------------------------
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // --------------------------------------------
  // HANDLERS
  // --------------------------------------------
  const handleSaved = () => {
    setEditingStudent(null);
    fetchStudents();
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (err) {
      alert('Failed to delete student');
    }
  };

  // --------------------------------------------
  // STATS — computed from students array
  // --------------------------------------------
  // Total students
  const totalStudents = students.length;

  // Unique courses (using Set to remove duplicates)
  const uniqueCourses = new Set(students.map((s) => s.course)).size;

  // Average age (rounded)
  const avgAge =
    students.length > 0
      ? Math.round(students.reduce((sum, s) => sum + Number(s.age), 0) / students.length)
      : 0;

  // --------------------------------------------
  // RENDER
  // --------------------------------------------
  return (
    <div className="app">
      {/* ---------- HEADER ---------- */}
      <header className="app-header">
        <h1>🎓 Student Management System</h1>
        <p className="subtitle">React · Node · Express · MySQL</p>
      </header>

      <main className="app-main">
        {/* ---------- STATS BAR ---------- */}
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{totalStudents}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">📚</div>
            <div className="stat-value">{uniqueCourses}</div>
            <div className="stat-label">Courses</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{avgAge}</div>
            <div className="stat-label">Avg Age</div>
          </div>
        </div>

        {/* ---------- FORM ---------- */}
        <StudentForm
          editingStudent={editingStudent}
          onSaved={handleSaved}
          onCancel={() => setEditingStudent(null)}
        />

        {/* ---------- TABLE ---------- */}
               {/* ---------- TABLE ---------- */}
        <StudentTable
          students={students}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default Home;