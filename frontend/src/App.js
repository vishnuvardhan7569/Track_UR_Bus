import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminNavbar from './components/AdminNavbar';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults'; 
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import AddBus from './pages/AddBus';
import ManageRoutes from './pages/ManageRoutes';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Contact from './pages/Contact';
import UserNotifications from './pages/UserNotifications';
import ContactSubmissions from './pages/ContactSubmissions';
import DriverDashboard from './pages/DriverDashboard';
import DriverNavbar from './components/DriverNavbar';
import WaitForApproval from './pages/WaitForApproval';
import ScrollToTop from './components/ScrollToTop';
import Feedback from './pages/Feedback';
import Help from './pages/Help';
import AdminFeedback from './pages/AdminFeedback';

// Layout component that includes Navbar and Footer
function Layout({ children, setIsAuthenticated }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

// Layout for driver pages
function DriverLayout({ children, setIsAuthenticated }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DriverNavbar setIsAuthenticated={setIsAuthenticated} />
      <main style={{ flex: 1, marginTop: 60 }}>{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const onStorage = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          !isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> :
          (localStorage.getItem('role') === 'driver' ? <Navigate to="/driver/dashboard" /> : <Navigate to="/dashboard" />)
        } />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/login" />} />
        
        {/* Protected routes with Navbar and Footer */}
        <Route path="/" element={
          isAuthenticated ?
            (localStorage.getItem('role') === 'driver' ? <Navigate to="/driver/dashboard" /> : <Navigate to="/dashboard" />)
            : <Navigate to="/login" />
        } />
        <Route path="/dashboard" element={isAuthenticated ? <Layout setIsAuthenticated={setIsAuthenticated}><Dashboard setIsAuthenticated={setIsAuthenticated} /></Layout> : <Navigate to="/login" />} />
        <Route path="/search" element={isAuthenticated ? <Layout setIsAuthenticated={setIsAuthenticated}><Home setIsAuthenticated={setIsAuthenticated} /></Layout> : <Navigate to="/login" />} />
        <Route path="/results" element={isAuthenticated ? <Layout setIsAuthenticated={setIsAuthenticated}><SearchResults setIsAuthenticated={setIsAuthenticated} /></Layout> : <Navigate to="/login" />} />
        <Route path="/about" element={isAuthenticated ? <Layout setIsAuthenticated={setIsAuthenticated}><About setIsAuthenticated={setIsAuthenticated} /></Layout> : <Navigate to="/login" />} />
        <Route path="/contact" element={isAuthenticated ? <Layout setIsAuthenticated={setIsAuthenticated}><Contact setIsAuthenticated={setIsAuthenticated} /></Layout> : <Navigate to="/login" />} />
        <Route path="/notifications" element={isAuthenticated ? <Layout setIsAuthenticated={setIsAuthenticated}><UserNotifications setIsAuthenticated={setIsAuthenticated} /></Layout> : <Navigate to="/login" />} />
        
        {/* Admin routes with AdminNavbar and Footer */}
        <Route path="/admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/admin/dashboard/*" element={isAuthenticated ? <AdminLayout setIsAuthenticated={setIsAuthenticated}><AdminDashboard setIsAuthenticated={setIsAuthenticated} /></AdminLayout> : <Navigate to="/login" />} />
        <Route path="/admin/add-bus" element={isAuthenticated ? <AdminLayout setIsAuthenticated={setIsAuthenticated}><AddBus setIsAuthenticated={setIsAuthenticated} /></AdminLayout> : <Navigate to="/login" />} />
        <Route path="/admin/manage-routes" element={isAuthenticated ? <AdminLayout setIsAuthenticated={setIsAuthenticated}><ManageRoutes setIsAuthenticated={setIsAuthenticated} /></AdminLayout> : <Navigate to="/login" />} />
        <Route path="/admin/notifications" element={isAuthenticated ? <AdminLayout setIsAuthenticated={setIsAuthenticated}><Notifications setIsAuthenticated={setIsAuthenticated} /></AdminLayout> : <Navigate to="/login" />} />
        <Route path="/admin/contact-submissions" element={isAuthenticated ? <AdminLayout setIsAuthenticated={setIsAuthenticated}><ContactSubmissions setIsAuthenticated={setIsAuthenticated} /></AdminLayout> : <Navigate to="/login" />} />
        <Route path="/admin/feedback" element={isAuthenticated ? <AdminLayout setIsAuthenticated={setIsAuthenticated}><AdminFeedback /></AdminLayout> : <Navigate to="/login" />} />
        <Route path="/driver/dashboard" element={<DriverLayout setIsAuthenticated={setIsAuthenticated}><DriverDashboard /></DriverLayout>} />
        <Route path="/wait-for-approval" element={<WaitForApproval />} />
        <Route path="/help" element={<Layout setIsAuthenticated={setIsAuthenticated}><Help /></Layout>} />
        <Route path="/feedback" element={<Layout setIsAuthenticated={setIsAuthenticated}><Feedback /></Layout>} />
      </Routes>
    </>
  );
}

export default App;
