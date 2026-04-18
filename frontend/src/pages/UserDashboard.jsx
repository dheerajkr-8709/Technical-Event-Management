import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
 const { user } = useAuth();
 const [selectedCategory, setSelectedCategory] = useState('');

 const categories = ['Catering', 'Florist', 'Decoration', 'Lighting'];

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/user/vendors', label: ' Vendor' },
 { to: '/user/cart', label: ' Cart' },
 { to: '/user/guests', label: ' Guest List' },
 { to: '/user/orders', label: ' Order Status' },
 ]} />
 <div className="page-content">
 <div className="welcome-section">
 <h1 className="welcome-title">Welcome User</h1>
 <p className="welcome-subtitle">Hello {user?.name}, plan your perfect event</p>
 </div>

 <div className="category-filter">
 {categories.map(cat => (
 <Link
 key={cat}
 to={`/user/vendors?category=${cat}`}
 className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
 onClick={() => setSelectedCategory(cat)}
 >
 {cat}
 </Link>
 ))}
 </div>

 <div className="dashboard-grid">
 <Link to="/user/vendors" className="dashboard-card">
 <h3> Vendor</h3>
 <p>Browse vendors by category</p>
 </Link>
 <Link to="/user/cart" className="dashboard-card">
 <h3> Cart</h3>
 <p>View your shopping cart</p>
 </Link>
 <Link to="/user/guests" className="dashboard-card">
 <h3> Guest List</h3>
 <p>Manage your guest list</p>
 </Link>
 <Link to="/user/orders" className="dashboard-card">
 <h3> Order Status</h3>
 <p>Track your orders</p>
 </Link>
 </div>
 </div>
 </div>
 );
}
