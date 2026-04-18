import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function AdminMaintenance() {
 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/admin/orders', label: ' Order Status' },
 ]} />
 <div className="page-content">
 <div className="section-header">Maintenance Menu (Admin Access Only)</div>
 <div className="maintenance-grid">
 <div className="maintenance-card">
 <h3> Membership</h3>
 <div className="maintenance-links">
 <Link to="/admin/membership/add" className="maintenance-link"> Add</Link>
 <Link to="/admin/membership/update" className="maintenance-link"> Update</Link>
 </div>
 </div>
 <div className="maintenance-card">
 <h3> User Management</h3>
 <div className="maintenance-links">
 <Link to="/admin/users" className="maintenance-link"> Manage Users</Link>
 </div>
 </div>
 <div className="maintenance-card">
 <h3> Vendor Management</h3>
 <div className="maintenance-links">
 <Link to="/admin/vendors" className="maintenance-link"> Manage Vendors</Link>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
