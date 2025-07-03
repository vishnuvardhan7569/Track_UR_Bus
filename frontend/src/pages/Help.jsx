function Help() {
  return (
    <div style={{ minHeight: '60vh', maxWidth: '95%', margin: '20px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 32, marginTop: 80 }}>
      <h2 style={{ color: '#1976d2', marginBottom: 24 }}>❓ Help Center</h2>
      <h3>Frequently Asked Questions</h3>
      <ul style={{ marginBottom: 32, paddingLeft: 20 }}>
        <li style={{ marginBottom: 16 }}><strong>How do I track a bus?</strong><br />Use the search page to find your bus by vehicle number, route, or stops. Click on a bus to see its real-time location.</li>
        <li style={{ marginBottom: 16 }}><strong>Why can't I see notifications?</strong><br />Make sure you are logged in and your account is approved. If you still have issues, contact support.</li>
        <li style={{ marginBottom: 16 }}><strong>How do I contact support?</strong><br />Use the Contact page or email info@bustracker.com. You can also submit feedback via the Feedback page.</li>
        <li style={{ marginBottom: 16 }}><strong>How do I become a driver or admin?</strong><br />Sign up and select the appropriate role. Your request will be reviewed by the main admin.</li>
      </ul>
      <h3>Need more help?</h3>
      <p>Contact our support team at <a href="/contact">info@bustracker.com</a> or call +91 123-4567-890.</p>
    </div>
  );
}

export default Help; 