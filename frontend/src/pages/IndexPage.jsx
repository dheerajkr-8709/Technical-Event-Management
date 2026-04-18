import { Link } from 'react-router-dom';

export default function IndexPage() {
 return (
 <div className="index-container">
 <div className="index-card">
 <h1>Event Management System</h1>
 <p>Plan and manage your events seamlessly with our comprehensive platform for Admins, Vendors, and Users.</p>
 <div className="index-buttons">
 <Link to="/admin/login" className="index-role-btn">Admin Login</Link>
 <Link to="/vendor/login" className="index-role-btn">Vendor Login</Link>
 <Link to="/user/login" className="index-role-btn">User Login</Link>
 </div>
 </div>
 </div>
 );
}
