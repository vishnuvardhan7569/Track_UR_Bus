function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '20px 0 10px 0',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Company Info */}
          <div>
            <h3 style={{ marginBottom: '10px', color: '#3498db', fontSize: '18px' }}>🚌 Bus Tracker</h3>
            <p style={{ lineHeight: '1.4', marginBottom: '10px', fontSize: '14px' }}>
              Your reliable companion for real-time bus tracking and route information.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ marginBottom: '10px', color: '#3498db', fontSize: '16px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px' }}>
              <li style={{ marginBottom: '5px' }}>
                <a href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>🏠 Home</a>
              </li>
              <li style={{ marginBottom: '5px' }}>
                <a href="/search" style={{ color: 'white', textDecoration: 'none' }}>🔍 Search Buses</a>
              </li>
              <li style={{ marginBottom: '5px' }}>
                <a href="/about" style={{ color: 'white', textDecoration: 'none' }}>ℹ️ About Us</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ marginBottom: '10px', color: '#3498db', fontSize: '16px' }}>Contact Us</h4>
            <div style={{ lineHeight: '1.4', fontSize: '14px' }}>
              <p style={{ margin: '3px 0' }}>📧 info@bustracker.com</p>
              <p style={{ margin: '3px 0' }}>📞 +91 123-4567-890</p>
              <p style={{ margin: '3px 0' }}>🕒 Mon-Fri 8AM - 6PM</p>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ marginBottom: '10px', color: '#3498db', fontSize: '16px' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px' }}>
              <li style={{ marginBottom: '5px' }}>
                <a href="/help" style={{ color: 'white', textDecoration: 'none' }}>❓ Help Center</a>
              </li>
              <li style={{ marginBottom: '5px' }}>
                <a href="/contact" style={{ color: 'white', textDecoration: 'none' }}>📞 Contact Support</a>
              </li>
              <li style={{ marginBottom: '5px' }}>
                <a href="/feedback" style={{ color: 'white', textDecoration: 'none' }}>💬 Feedback</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #34495e',
          paddingTop: '15px',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '12px'
        }}>
          <div>
            <p style={{ margin: 0 }}>
              © {currentYear} Bus Tracker. All rights reserved.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <a href="/privacy" style={{ color: 'white', textDecoration: 'none' }}>
              Privacy Policy
            </a>
            <a href="/terms" style={{ color: 'white', textDecoration: 'none' }}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 