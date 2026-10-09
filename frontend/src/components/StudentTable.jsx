// ============================================
// STUDENT TABLE — with Search, Sort, Loading Spinner
// ============================================

import { useState, useMemo } from 'react';

function StudentTable({ students, loading, onEdit, onDelete }) {
  // --------------------------------------------
  // STATE: search + sort
  // --------------------------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');       // id | name | age
  const [sortDirection, setSortDirection] = useState('desc'); // asc | desc

  // --------------------------------------------
  // HANDLER: click sort button
  // --------------------------------------------
  const handleSort = (field) => {
    if (sortField === field) {
      // Same field clicked → toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field → default ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // --------------------------------------------
  // DERIVED DATA: filtered + sorted students
  // --------------------------------------------
  // useMemo = only recompute when inputs change (performance)
  const filteredAndSorted = useMemo(() => {
    // 1) FILTER by search term
    let result = students;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((s) =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.course.toLowerCase().includes(term)
      );
    }

    // 2) SORT by field + direction
    result = [...result].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // For names, compare as strings (case-insensitive)
      if (sortField === 'name') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      // For age/id, compare as numbers
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, searchTerm, sortField, sortDirection]);

  // --------------------------------------------
  // RENDER: Loading spinner
  // --------------------------------------------
  if (loading) {
    return (
      <div className="card">
        <h2 className="card-title">📋 All Students</h2>
        <div className="spinner-wrapper">
          <div className="spinner"></div>
          <p className="spinner-text">Loading students...</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------
  // RENDER: Empty state (no students at all)
  // --------------------------------------------
  if (students.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">📋 All Students</h2>
        <p className="empty-msg">No students yet. Add one above! 👆</p>
      </div>
    );
  }

  // --------------------------------------------
  // RENDER: Main table
  // --------------------------------------------
  return (
    <div className="card">
      <h2 className="card-title">
        📋 All Students ({filteredAndSorted.length}
        {searchTerm && ` of ${students.length}`})
      </h2>

      {/* ---------- Toolbar: Search + Sort ---------- */}
      <div className="table-toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sort-buttons">
          <span className="sort-label">Sort:</span>
          <button
            className={`sort-btn ${sortField === 'name' ? 'active' : ''}`}
            onClick={() => handleSort('name')}
          >
            Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            className={`sort-btn ${sortField === 'age' ? 'active' : ''}`}
            onClick={() => handleSort('age')}
          >
            Age {sortField === 'age' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            className={`sort-btn ${sortField === 'id' ? 'active' : ''}`}
            onClick={() => handleSort('id')}
          >
            ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* ---------- Table ---------- */}
      {filteredAndSorted.length === 0 ? (
        <p className="empty-msg">No students match your search 🔍</p>
      ) : (
        <div className="table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.age}</td>
                  <td>
                    <span className="course-pill">{student.course}</span>
                  </td>
                  <td>
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => onEdit(student)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => onDelete(student.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentTable;