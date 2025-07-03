import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Navbar({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (setIsAuthenticated) setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavClick = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { path: '/dashboard', label: '🏠 Home', icon: '🏠' },
    { path: '/search', label: '🔍 Search', icon: '🔍' },
    { path: '/about', label: 'ℹ️ About', icon: 'ℹ️' },
    { path: '/notifications', label: '🔔 Notifications', icon: '��' },
    { path: '/help', label: '❓ FAQ', icon: '❓' },
    { path: '/contact', label: '📞 Contact', icon: '📞' }
  ];

  const isMobile = window.innerWidth <= 600;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '10px' : '20px 40px',
      background: '#2c3e50',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      boxSizing: 'border-box',
      zIndex: 1000,
    }}>
      <div style={{ fontWeight: 'bold', fontSize: isMobile ? '1.2rem' : '1.5rem',color: 'white' }}>Bus Tracker</div>
      {isMobile ? (
        <div>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            ☰
          </button>
          {menuOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isActive(item.path) ? '#3498db' : 'white',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: isActive(item.path) ? 'bold' : 'normal',
                    transition: 'all 0.3s ease',
                    borderBottom: isActive(item.path) ? '3px solid #3498db' : '3px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.backgroundColor = '#34495e';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px' }}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={isActive(item.path) ? 'navbar-active' : ''}
              style={{
                background: 'none',
                border: 'none',
                color: isActive(item.path) ? '#3498db' : 'white',
                padding: '10px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: isActive(item.path) ? 'bold' : 'normal',
                transition: 'all 0.3s ease',
                borderBottom: isActive(item.path) ? '3px solid #3498db' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.backgroundColor = '#34495e';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
      >
        🚪 Logout
      </button>
    </nav>
  );
}

export default Navbar; 