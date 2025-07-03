import AdminUpdateLocation from '../components/AdminUpdateLocation';

function Admin() {
  return (
    <div style={{ padding: '40px' }}>
      <h2>🛠️ Admin Dashboard</h2>
      <AdminUpdateLocation />
      {/* You can later add more sections here like AddBus, ViewAllBuses, etc. */}
    </div>
  );
}

export default Admin;
