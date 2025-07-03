import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ContactSubmissions({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/contact/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        if (setIsAuthenticated) setIsAuthenticated(false);
        navigate('/login', { replace: true });
      } else {
        setError('Error fetching contact submissions');
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/contact/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchContacts(); // Refresh the list
    } catch (err) {
      setError('Error updating contact status');
    }
  };

  const markAsReplied = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/contact/${id}/replied`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchContacts(); // Refresh the list
    } catch (err) {
      setError('Error updating contact status');
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact submission?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchContacts(); // Refresh the list
    } catch (err) {
      setError('Error deleting contact submission');
    }
  };

  const sendReply = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/contact/${id}/reply`, { reply: replyText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReplyingId(null);
      setReplyText('');
      fetchContacts();
    } catch (err) {
      setError('Error sending reply');
    }
  };

  const deleteReply = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/contact/${id}/delete-reply`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchContacts();
    } catch (err) {
      setError('Error deleting reply');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#dc3545';
      case 'read': return '#ffc107';
      case 'replied': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'new': return 'New';
      case 'read': return 'Read';
      case 'replied': return 'Replied';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(120deg, #f8fafc 0%, #e3f0ff 100%)'
      }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading contact submissions...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(120deg, #f8fafc 0%, #e3f0ff 100%)'
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
          <h1>📧 Contact Submissions</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>

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

        {contacts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#666',
            fontSize: '18px'
          }}>
            No contact submissions found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '20px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Subject</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Message</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>{contact.name}</td>
                    <td style={{ padding: '12px' }}>
                      <a href={`mailto:${contact.email}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                        {contact.email}
                      </a>
                    </td>
                    <td style={{ padding: '12px' }}>{contact.subject}</td>
                    <td style={{ padding: '12px', maxWidth: '300px' }}>
                      <div style={{ 
                        maxHeight: '100px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {contact.message}
                      </div>
                      {/* Show reply if exists */}
                      {contact.status === 'replied' && contact.reply && (
                        <div style={{ marginTop: 8, background: '#e8f5e9', padding: 8, borderRadius: 4, color: '#388e3c', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <span><strong>Reply:</strong> {contact.reply}</span>
                          <button onClick={() => deleteReply(contact._id)} style={{ background: 'none', border: 'none', color: '#dc3545', fontSize: 18, cursor: 'pointer' }} title="Delete Reply">🗑️</button>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {new Date(contact.timestamp).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: getStatusColor(contact.status),
                        color: 'white'
                      }}>
                        {getStatusText(contact.status)}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {contact.status === 'new' && (
                          <button
                            onClick={() => markAsRead(contact._id)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#ffc107',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Mark Read
                          </button>
                        )}
                        {contact.status !== 'replied' && (
                          <button
                            onClick={() => markAsReplied(contact._id)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Mark Replied
                          </button>
                        )}
                        {/* Reply button and form */}
                        {contact.status !== 'replied' && (
                          replyingId === contact._id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <textarea
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                rows={2}
                                placeholder="Type your reply..."
                                style={{ minWidth: 180, maxWidth: 220, borderRadius: 4, border: '1px solid #ccc', padding: 4 }}
                              />
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button
                                  onClick={() => sendReply(contact._id)}
                                  style={{ padding: '4px 8px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}
                                  disabled={!replyText.trim()}
                                >
                                  Send Reply
                                </button>
                                <button
                                  onClick={() => { setReplyingId(null); setReplyText(''); }}
                                  style={{ padding: '4px 8px', backgroundColor: '#888', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setReplyingId(contact._id); setReplyText(''); }}
                              style={{ padding: '4px 8px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}
                            >
                              Reply
                            </button>
                          )
                        )}
                        <button
                          onClick={() => deleteContact(contact._id)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactSubmissions; 