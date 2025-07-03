import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';

function AdminNavbar({ setIsAuthenticated }) {
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

  const navItems = [
    { path: '/admin/dashboard', label: '🏠 Dashboard', icon: '🏠' },
    { path: '/admin/add-bus', label: '➕ Add Bus', icon: '➕' },
    { path: '/admin/manage-routes', label: '🛣️ Manage Routes', icon: '🛣️' },
    { path: '/admin/notifications', label: '🔔 Notifications', icon: '🔔' },
    { path: '/admin/contact-submissions', label: '📧 Contact Submissions', icon: '📧' },
    { path: '/dashboard', label: '👥 User View', icon: '👥' }
  ];

  return (
    <nav style={{
      backgroundColor: '#1a252f',
      padding: '12px 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        gap: '20px'
      }}>
        {/* Logo */}
        <div 
          onClick={() => navigate('/admin/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            minWidth: 'fit-content'
          }}
        >
          🛠️ Admin Panel
        </div>

        {/* Navigation Links - All in one row */}
        <div style={{
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          flexWrap: 'nowrap',
          overflowX: 'auto'
        }}>
          {navItems.map((item, idx) => (
            <React.Fragment key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive(item.path) ? '#ffc107' : 'white',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isActive(item.path) ? 'bold' : 'normal',
                  transition: 'all 0.3s ease',
                  borderBottom: isActive(item.path) ? '3px solid #ffc107' : '3px solid transparent',
                  whiteSpace: 'nowrap',
                  minWidth: 'fit-content'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.backgroundColor = '#2c3e50';
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
              {/* Insert Feedback button right after Notifications button */}
              {item.path === '/admin/notifications' && (
                <button
                  key="/admin/feedback"
                  onClick={() => navigate('/admin/feedback')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isActive('/admin/feedback') ? '#ffc107' : 'white',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: isActive('/admin/feedback') ? 'bold' : 'normal',
                    transition: 'all 0.3s ease',
                    borderBottom: isActive('/admin/feedback') ? '3px solid #ffc107' : '3px solid transparent',
                    whiteSpace: 'nowrap',
                    minWidth: 'fit-content'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive('/admin/feedback')) {
                      e.target.style.backgroundColor = '#2c3e50';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive('/admin/feedback')) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  Feedback
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease',
            minWidth: 'fit-content'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar; 