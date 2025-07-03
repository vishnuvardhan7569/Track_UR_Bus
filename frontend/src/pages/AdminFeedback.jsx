import { useEffect, useState } from 'react';

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/feedback`);
      if (!res.ok) throw new Error('Failed to fetch feedback');
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      setError('Could not load feedback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/feedback/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete feedback');
      fetchFeedbacks();
    } catch (err) {
      setError('Could not delete feedback.');
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: '#1976d2', marginBottom: 24 }}>📋 User Feedback</h2>
      {loading ? (
        <div>Loading feedback...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : feedbacks.length === 0 ? (
        <div style={{ color: '#888' }}>No feedback submitted yet.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 12, border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: 12, border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: 12, border: '1px solid #ddd' }}>Message</th>
              <th style={{ padding: 12, border: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: 12, border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map(fb => (
              <tr key={fb._id}>
                <td style={{ padding: 10, border: '1px solid #eee' }}>{fb.name}</td>
                <td style={{ padding: 10, border: '1px solid #eee' }}>{fb.email}</td>
                <td style={{ padding: 10, border: '1px solid #eee' }}>{fb.message}</td>
                <td style={{ padding: 10, border: '1px solid #eee' }}>{new Date(fb.createdAt).toLocaleString()}</td>
                <td style={{ padding: 10, border: '1px solid #eee', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button onClick={() => handleDelete(fb._id)} style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', fontWeight: 'bold', fontSize: 18 }} title="Delete">🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminFeedback; 