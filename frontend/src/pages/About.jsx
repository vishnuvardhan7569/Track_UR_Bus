import { useNavigate } from 'react-router-dom';

function About({ setIsAuthenticated }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(120deg, #f8fafc 0%, #e3f0ff 100%)',
      marginTop: 80,
    }}>
      <div style={{
        width: '100%',
        maxWidth: '95%',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: 40,
        margin: '20px auto',
        flex: 1
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>ℹ️ About Bus Tracker</h1>
        </div>

        <div style={{ lineHeight: '1.8' }}>
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>🚌 Our Mission</h2>
            <p style={{ fontSize: '18px', marginBottom: '15px' }}>
              Bus Tracker is dedicated to revolutionizing public transportation by providing real-time bus tracking 
              and route information to make your daily commute more convenient and reliable.
            </p>
            <p style={{ fontSize: '16px', color: '#666' }}>
              We believe that everyone deserves access to accurate, up-to-date information about their bus routes, 
              helping you save time and reduce stress during your daily travels.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>✨ Key Features</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ color: '#3498db', marginBottom: '10px' }}>📍 Real-Time Tracking</h3>
                <p>Track buses in real-time with accurate GPS coordinates and live location updates.</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ color: '#3498db', marginBottom: '10px' }}>🔍 Smart Search</h3>
                <p>Search buses by vehicle number, route, or source-destination combinations.</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ color: '#3498db', marginBottom: '10px' }}>🔔 Notifications</h3>
                <p>Receive timely notifications about bus delays, route changes, and important updates.</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ color: '#3498db', marginBottom: '10px' }}>📱 User-Friendly</h3>
                <p>Intuitive interface designed for easy navigation and quick access to information.</p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>👥 Our Team</h2>
            <p style={{ fontSize: '16px', marginBottom: '15px' }}>
              Bus Tracker is developed by a dedicated team of professionals committed to improving 
              public transportation experiences through innovative technology solutions.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '50px', marginBottom: '10px' }}>👨‍💻</div>
                <h4>Development Team</h4>
                <p style={{ color: '#666' }}>Creating innovative solutions</p>
              </div>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '50px', marginBottom: '10px' }}>🎨</div>
                <h4>Design Team</h4>
                <p style={{ color: '#666' }}>Crafting user experiences</p>
              </div>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '50px', marginBottom: '10px' }}>🔧</div>
                <h4>Support Team</h4>
                <p style={{ color: '#666' }}>Ensuring smooth operations</p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>📈 Our Impact</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'center' }}>
              <div>
                <h3 style={{ color: '#27ae60', fontSize: '36px', margin: '0' }}>1000+</h3>
                <p style={{ color: '#666' }}>Active Users</p>
              </div>
              <div>
                <h3 style={{ color: '#27ae60', fontSize: '36px', margin: '0' }}>50+</h3>
                <p style={{ color: '#666' }}>Bus Routes</p>
              </div>
              <div>
                <h3 style={{ color: '#27ae60', fontSize: '36px', margin: '0' }}>99%</h3>
                <p style={{ color: '#666' }}>Accuracy Rate</p>
              </div>
              <div>
                <h3 style={{ color: '#27ae60', fontSize: '36px', margin: '0' }}>24/7</h3>
                <p style={{ color: '#666' }}>Service Available</p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>🚀 Technology</h2>
            <p style={{ fontSize: '16px', marginBottom: '15px' }}>
              Built with modern technologies to ensure reliability, scalability, and performance:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', borderRadius: '20px', fontSize: '14px' }}>
                React.js
              </span>
              <span style={{ padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', borderRadius: '20px', fontSize: '14px' }}>
                Node.js
              </span>
              <span style={{ padding: '8px 16px', backgroundColor: '#f39c12', color: 'white', borderRadius: '20px', fontSize: '14px' }}>
                MongoDB
              </span>
              <span style={{ padding: '8px 16px', backgroundColor: '#27ae60', color: 'white', borderRadius: '20px', fontSize: '14px' }}>
                Express.js
              </span>
              <span style={{ padding: '8px 16px', backgroundColor: '#9b59b6', color: 'white', borderRadius: '20px', fontSize: '14px' }}>
                Leaflet Maps
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About; 