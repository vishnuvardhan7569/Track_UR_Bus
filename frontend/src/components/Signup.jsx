import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      if (res.data.msg?.includes('admin approval')) {
        localStorage.setItem('pendingEmail', form.email);
        localStorage.setItem('userName', form.name);
        localStorage.setItem('pendingRole', form.role);
        navigate('/wait-for-approval');
      } else {
        setSuccessMsg('Registration successful! Please log in.');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(120deg, #f8fafc 0%, #e3f0ff 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '30%',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: 32,
        margin: 16,
        boxSizing: 'border-box'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#007bff' }}>
          📝 Sign Up
        </h2>
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '20px' }}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="username"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box',
                paddingRight: '40px'
              }}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#888',
                userSelect: 'none'
              }}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                backgroundColor: '#fff',
                color: '#333',
                boxSizing: 'border-box'
              }}
            >
              <option value="student">Student</option>
              <option value="driver">Driver</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxSizing: 'border-box'
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        {errorMsg && (
          <div style={{
            color: '#dc3545',
            backgroundColor: '#f8d7da',
            padding: '10px',
            borderRadius: '5px',
            marginTop: '20px',
            textAlign: 'center'
          }}>{errorMsg}</div>
        )}
        {successMsg && (
          <div style={{
            color: '#28a745',
            backgroundColor: '#d4edda',
            padding: '10px',
            borderRadius: '5px',
            marginTop: '20px',
            textAlign: 'center'
          }}>{successMsg}</div>
        )}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#6c757d' }}>Already have an account? </span>
          <a href="/login" style={{ color: '#007bff', fontWeight: 'bold' }}>Login</a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
