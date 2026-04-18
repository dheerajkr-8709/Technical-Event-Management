import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
 const { user } = useAuth();

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/admin/maintenance', label: ' Maintenance' },
 { to: '/admin/orders', label: ' Order Status' },
 ]} />
 <div className="page-content">
 <div className="welcome-section">
 <h1 className="welcome-title">Welcome Admin</h1>
 <p className="welcome-subtitle">Hello {user?.name}, manage your event system from here</p>
 </div>
 <div className="dashboard-grid">
 <Link to="/admin/users" className="dashboard-card">
 <h3> Maintain User</h3>
 <p>Add, update, or remove users</p>
 </Link>
 <Link to="/admin/vendors" className="dashboard-card">
 <h3> Maintain Vendor</h3>
 <p>Add, update, or remove vendors</p>
 </Link>
 <Link to="/admin/maintenance" className="dashboard-card">
 <h3> Maintenance</h3>
 <p>Membership & user management</p>
 </Link>
 <Link to="/admin/orders" className="dashboard-card">
 <h3> Order Status</h3>
 <p>View and manage all orders</p>
 </Link>
 </div>
 </div>
 </div>
 );
}
