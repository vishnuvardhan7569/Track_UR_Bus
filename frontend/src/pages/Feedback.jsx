import { useState } from 'react';

function Feedback() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to submit feedback');
      setSubmitted(true);
    } catch (err) {
      setError('Could not submit feedback. Please try again later.');
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 80 }}>
        <h2>Thank you for your feedback! 💬</h2>
        <p>We appreciate your input and will use it to improve our service.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 75, maxWidth: '95%' }}>
      <h2 style={{ color: '#1976d2', marginBottom: 24 }}>💬 Feedback</h2>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', minWidth: 320, maxWidth: 400 }}>
        <div style={{ marginBottom: 16 }}>
          <label>Name:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required style={{ width: '45vh', padding: 8, borderRadius: 5, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Email:</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required style={{ width: '45vh', padding: 8, borderRadius: 5, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Message:</label>
          <textarea name="message" value={form.message} onChange={handleChange} required rows={4} style={{ width: '45vh', padding: 8, borderRadius: 5, border: '1px solid #ccc' }} />
        </div>
        <button type="submit" style={{ background: '#1976d2', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: 5, fontWeight: 'bold', cursor: 'pointer' }}>Submit</button>
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      </form>
    </div>
  );
}

export default Feedback; 