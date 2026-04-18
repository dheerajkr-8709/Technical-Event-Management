import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function UserVendors() {
 const { token } = useAuth();
 const [vendors, setVendors] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [searchParams, setSearchParams] = useSearchParams();
 const category = searchParams.get('category') || '';

 const categories = ['Catering', 'Florist', 'Decoration', 'Lighting'];

 useEffect(() => { fetchVendors(); }, [category]);

 const fetchVendors = async () => {
 setLoading(true);
 try {
 const url = category 
 ? `http://localhost:5000/api/user/vendors?category=${category}`
 : 'http://localhost:5000/api/user/vendors';
 const res = await axios.get(url, {
 headers: { Authorization: `Bearer ${token}` }
 });
 setVendors(res.data);
 } catch (err) {
 setError('Failed to load vendors');
 } finally {
 setLoading(false);
 }
 };

 const selectCategory = (cat) => {
 if (category === cat) {
 setSearchParams({});
 } else {
 setSearchParams({ category: cat });
 }
 };

 if (loading) return <div className="loading"><div className="spinner"></div></div>;

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/user/cart', label: ' Cart' },
 { to: '/user/guests', label: ' Guest List' },
 { to: '/user/orders', label: ' Order Status' },
 ]} />
 <div className="page-content">
 <div className="category-filter">
 {categories.map(cat => (
 <button
 key={cat}
 className={`category-btn ${category === cat ? 'active' : ''}`}
 onClick={() => selectCategory(cat)}
 >
 {cat}
 </button>
 ))}
 </div>

 <div className="section-header">
 {category ? `${category} Vendors` : 'All Vendors'}
 </div>

 {error && <div className="message error">{error}</div>}

 {vendors.length === 0 ? (
 <div className="empty-state">
 <h3>No vendors found</h3>
 <p>{category ? `No ${category} vendors available` : 'No vendors available'}</p>
 </div>
 ) : (
 <div className="card-grid">
 {vendors.map(vendor => (
 <div key={vendor._id} className="vendor-card">
 <h3>{vendor.name}</h3>
 <p>{vendor.contactDetails || vendor.category}</p>
 <Link to={`/user/vendors/${vendor._id}/products`} className="btn btn-primary btn-sm">
 Shop Item
 </Link>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}
