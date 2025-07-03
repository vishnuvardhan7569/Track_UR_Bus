import AdminNavbar from './AdminNavbar';
import Footer from './Footer';

// Admin Layout component that includes AdminNavbar and Footer
function AdminLayout({ children, setIsAuthenticated }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <AdminNavbar setIsAuthenticated={setIsAuthenticated} />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default AdminLayout; 