import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Contact({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_BASE_URL}/contact/submit`, formData);
      setSuccess('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <h1>📞 Contact Us</h1>
        </div>

        {success && (
          <div style={{ 
            color: '#155724', 
            backgroundColor: '#d4edda', 
            padding: '15px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            border: '1px solid #c3e6cb'
          }}>
            {success}
          </div>
        )}

        {error && (
          <div style={{ 
            color: '#721c24', 
            backgroundColor: '#f8d7da', 
            padding: '15px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Contact Information */}
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>Get in Touch</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '30px', color: '#666' }}>
              Have questions, suggestions, or need support? We're here to help! 
              Reach out to us through any of the following channels.
            </p>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#3498db', marginBottom: '20px' }}>📍 Office Address</h3>
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px' }}>
                <span style={{ fontSize: '20px', marginRight: '15px', marginTop: '2px' }}>🏢</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Bus Tracker Headquarters</p>
                  <p style={{ margin: 0, color: '#666' }}>123 Bus Street, Vijayawada</p>
                  <p style={{ margin: 0, color: '#666' }}>Andhra Pradesh, India 12345</p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#3498db', marginBottom: '20px' }}>📞 Contact Details</h3>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '20px', marginRight: '15px' }}>📧</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Email</p>
                  <p style={{ margin: 0, color: '#666' }}>info@bustracker.com</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '20px', marginRight: '15px' }}>📱</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Phone</p>
                  <p style={{ margin: 0, color: '#666' }}>+91 123-4567-890</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '20px', marginRight: '15px' }}>🕒</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Business Hours</p>
                  <p style={{ margin: 0, color: '#666' }}>Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p style={{ margin: 0, color: '#666' }}>Saturday: 9:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ color: '#3498db', marginBottom: '20px' }}>🚀 Quick Support</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={() => navigate('/help')}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px'
                  }}
                >
                  ❓ Help Center
                </button>
                <button 
                  onClick={() => navigate('/help')}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px'
                  }}
                >
                  ❔ FAQ
                </button>
                <button 
                  onClick={() => navigate('/feedback')}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#f39c12',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px'
                  }}
                >
                  💬 Send Feedback
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px'
                  }}
                  placeholder="Your full name"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px'
                  }}
                  placeholder="your.email@example.com"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px'
                  }}
                  placeholder="What is this about?"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="13"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact; 