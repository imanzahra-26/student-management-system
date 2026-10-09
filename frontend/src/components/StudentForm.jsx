// ============================================
// STUDENT FORM — Add or Edit a student
// ============================================

import { useState, useEffect } from 'react';
import { addStudent, updateStudent } from '../api/studentApi';

function StudentForm({ editingStudent, onSaved, onCancel }) {
  // --------------------------------------------
  // STATE: form field values
  // --------------------------------------------
  // One state object holding all 4 fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    course: '',
  });

  // Loading state (button shows "Saving..." while waiting)
  const [loading, setLoading] = useState(false);

  // Error message (if backend returns error)
  const [error, setError] = useState('');

  // --------------------------------------------
  // EFFECT: when user clicks "Edit" on a row,
  // fill the form with that student's data
  // --------------------------------------------
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name,
        email: editingStudent.email,
        age: editingStudent.age,
        course: editingStudent.course,
      });
    } else {
      // Reset form when not editing
      setFormData({ name: '', email: '', age: '', course: '' });
    }
  }, [editingStudent]);

  // --------------------------------------------
  // HANDLER: input change
  // --------------------------------------------
  // When user types, update the matching field in state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --------------------------------------------
  // HANDLER: form submit
  // --------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();          // stop page reload
    setError('');
    setLoading(true);

    try {
      if (editingStudent) {
        // UPDATE existing student
        await updateStudent(editingStudent.id, formData);
      } else {
        // ADD new student
        await addStudent(formData);
      }

      // Reset form
      setFormData({ name: '', email: '', age: '', course: '' });

      // Tell parent to refresh the list
      onSaved();
    } catch (err) {
      // Show error from backend (if any)
      const msg = err.response?.data?.error || 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------
  // RENDER
  // --------------------------------------------
  return (
    <div className="card">
      <h2 className="card-title">
        {editingStudent ? '✏️ Edit Student' : '➕ Add New Student'}
      </h2>

      {/* Show error message if any */}
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="course"
            placeholder="Course"
            value={formData.course}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
         <button type="submit" className="btn btn-primary" disabled={loading}>
  {loading ? 'Saving...' : editingStudent ? '💾 Update Student' : '✨ Add Student'}
</button>

          {/* Show cancel button only when editing */}
          {editingStudent && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default StudentForm;