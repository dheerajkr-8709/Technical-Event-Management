import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function VendorRequestItems() {
 const { token } = useAuth();
 const [items, setItems] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');

 useEffect(() => { fetchItems(); }, []);

 const fetchItems = async () => {
 try {
 const res = await axios.get('http://localhost:5000/api/vendor/request-items', {
 headers: { Authorization: `Bearer ${token}` }
 });
 setItems(res.data);
 } catch (err) {
 setError('Failed to load request items');
 } finally {
 setLoading(false);
 }
 };

 if (loading) return <div className="loading"><div className="spinner"></div></div>;

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/vendor/products', label: ' Your Item' },
 { to: '/vendor/add-item', label: ' Add New Item' },
 { to: '/vendor/product-status', label: ' Product Status' },
 { to: '/vendor/request-items', label: ' Request Item', active: true },
 ]} />
 <div className="page-content">
 <div className="section-header">Request Item</div>
 {error && <div className="message error">{error}</div>}

 {items.length === 0 ? (
 <div className="empty-state">
 <h3>No requests yet</h3>
 <p>User requests for your products will appear here</p>
 </div>
 ) : (
 <div className="card-grid">
 {items.map((item, i) => (
 <div key={i} className="product-card">
 {item.image ? (
 <img src={`http://localhost:5000${item.image}`} alt={item.name} />
 ) : (
 <div style={{ width: '100%', height: 140, background: 'rgba(255,255,255,0.05)', borderRadius: 8, marginBottom: '1rem' }}></div>
 )}
 <h3>{item.name}</h3>
 <p className="price">Rs {item.price}/-</p>
 <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Qty: {item.quantity}</p>
 <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Customer: {item.customerName}</p>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}
