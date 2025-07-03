import { useNavigate } from 'react-router-dom';

const navStyleDesktop = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: '#2c3e50',
  color: 'white',
  padding: '12px 24px',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  zIndex: 1000,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  boxSizing: 'border-box',
  overflow: 'hidden',
};

const navStyleMobile = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  background: '#2c3e50',
  color: 'white',
  padding: '10px 8px',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  zIndex: 1000,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  boxSizing: 'border-box',
  overflow: 'hidden',
};

const logoStyleDesktop = {
  fontWeight: 'bold',
  fontSize: '1.3rem',
  letterSpacing: 1
};
const logoStyleMobile = {
  fontWeight: 'bold',
  fontSize: '1.3rem',
  letterSpacing: 1,
  textAlign: 'center',
  marginBottom: 8
};

const logoutBtnStyleDesktop = {
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease',
  boxSizing: 'border-box',
  whiteSpace: 'nowrap',
  maxWidth: '140px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};
const logoutBtnStyleMobile = {
  ...logoutBtnStyleDesktop,
  width: '100%',
  marginTop: 4,
  maxWidth: '100%',
};

function DriverNavbar({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 600;
  const userName = localStorage.getItem('userName') || '';

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (setIsAuthenticated) setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <nav style={isMobile ? navStyleMobile : navStyleDesktop}>
      <div style={isMobile ? logoStyleMobile : logoStyleDesktop}>🚌 Driver Panel</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {userName && (
          <span style={{ fontWeight: 'bold', marginRight: 8 }}>🧑‍✈️ Hello! {userName}</span>
        )}
        <button
          onClick={handleLogout}
          style={isMobile ? logoutBtnStyleMobile : logoutBtnStyleDesktop}
          onMouseEnter={e => e.target.style.backgroundColor = '#c0392b'}
          onMouseLeave={e => e.target.style.backgroundColor = '#e74c3c'}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default DriverNavbar; 