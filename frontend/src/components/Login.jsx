import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
        role
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        if (res.data.user?.role) {
          localStorage.setItem('role', res.data.user.role);
        }
        if (res.data.user?.id) {
          localStorage.setItem('userId', res.data.user.id);
        }
        if (res.data.user?.name) {
          localStorage.setItem('userName', res.data.user.name);
        }
        if (res.data.user?.email) {
          localStorage.setItem('userEmail', res.data.user.email);
        }
        if (setIsAuthenticated) setIsAuthenticated(true);
        const userRole = res.data.user?.role || role;
        if (userRole === 'driver') {
          navigate('/driver/dashboard');
        } else {
          navigate('/dashboard');
        }
        setSuccessMsg('Login successful!');
      } else {
        setErrorMsg('Login failed. Please try again.');
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setErrorMsg(err.response.data.msg || 'Invalid email or password');
      } else if (err.response?.status === 401) {
        setErrorMsg('Invalid email or password');
      } else if (err.response?.status === 403 && err.response.data.msg?.includes('awaiting admin approval')) {
        localStorage.setItem('pendingEmail', email);
        navigate('/wait-for-approval');
      } else if (err.response?.status === 500) {
        setErrorMsg('Server error. Please try later.');
      } else if (err.code === 'ECONNREFUSED') {
        setErrorMsg('Cannot connect to server. Please check if the backend is running.');
      } else {
        setErrorMsg('Network error. Please check your connection.');
      }
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
          🚌 University Bus Tracker
        </h2>
        <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h3>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              name="email"
              autoComplete="username"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              name="password"
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                paddingRight: '40px',
                boxSizing: 'border-box'
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
              value={role}
              onChange={e => setRole(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                background: '#f8fafc',
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
            {loading ? 'Logging in...' : 'Login'}
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
          }}>
            {errorMsg}
          </div>
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
          <p style={{ marginBottom: '15px', color: '#6c757d' }}>
            Don't have an account? <a href="/signup" style={{ color: '#007bff' }}>Sign up</a>
          </p>
          
          <div style={{ 
            backgroundColor: '#e3f2fd', 
            padding: '15px', 
            borderRadius: '5px',
            fontSize: '14px',
            color: '#1976d2'
          }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>📋 Sample Credentials:</p>
            <p style={{ margin: '5px 0' }}><strong>Student:</strong> student@university.edu / Student@2024!bus</p>
            <p style={{ margin: '5px 0' }}><strong>Admin:</strong> admin@university.edu / Admin@2024!bus</p>
            <p style={{ margin: '5px 0' }}><strong>Driver:</strong> driver@university.edu / Driver@2024!bus</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
