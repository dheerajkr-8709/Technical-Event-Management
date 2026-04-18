import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function VendorDashboard() {
 const { user } = useAuth();

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/vendor/products', label: ' Your Item' },
 { to: '/vendor/add-item', label: ' Add New Item' },
 { to: '/vendor/product-status', label: ' Transaction' },
 ]} />
 <div className="page-content">
 <div className="welcome-section">
 <h1 className="welcome-title">Welcome Vendor</h1>
 <p className="welcome-subtitle">Hello {user?.name} ({user?.category})</p>
 </div>
 <div className="dashboard-grid">
 <Link to="/vendor/products" className="dashboard-card">
 <h3> Your Item</h3>
 <p>View and manage your products</p>
 </Link>
 <Link to="/vendor/add-item" className="dashboard-card">
 <h3> Add New Item</h3>
 <p>Add a new product to your shop</p>
 </Link>
 <Link to="/vendor/product-status" className="dashboard-card">
 <h3> Product Status</h3>
 <p>View order transactions</p>
 </Link>
 <Link to="/vendor/request-items" className="dashboard-card">
 <h3> Request Items</h3>
 <p>Items requested by users</p>
 </Link>
 </div>
 </div>
 </div>
 );
}
