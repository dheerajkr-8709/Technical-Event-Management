import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function UserProducts() {
 const { token } = useAuth();
 const { vendorId } = useParams();
 const [products, setProducts] = useState([]);
 const [vendor, setVendor] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');

 useEffect(() => { fetchProducts(); }, [vendorId]);

 const fetchProducts = async () => {
 try {
 const res = await axios.get(`http://localhost:5000/api/user/vendors/${vendorId}/products`, {
 headers: { Authorization: `Bearer ${token}` }
 });
 setProducts(res.data.products);
 setVendor(res.data.vendor);
 } catch (err) {
 setError('Failed to load products');
 } finally {
 setLoading(false);
 }
 };

 const addToCart = async (productId) => {
 setError(''); setSuccess('');
 try {
 await axios.post('http://localhost:5000/api/user/cart', { productId, quantity: 1 }, {
 headers: { Authorization: `Bearer ${token}` }
 });
 setSuccess('Item added to cart!');
 setTimeout(() => setSuccess(''), 2000);
 } catch (err) {
 setError(err.response?.data?.message || 'Failed to add to cart');
 }
 };

 if (loading) return <div className="loading"><div className="spinner"></div></div>;

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/user/vendors', label: ' Vendors' },
 { to: '/user/cart', label: ' Cart' },
 { to: '/user/orders', label: ' Order Status' },
 ]} />
 <div className="page-content">
 {vendor && (
 <div className="section-header">{vendor.name}</div>
 )}
 
 <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
 <span className="form-label">Products</span>
 </div>

 {error && <div className="message error">{error}</div>}
 {success && <div className="message success">{success}</div>}

 {products.length === 0 ? (
 <div className="empty-state">
 <h3>No products available</h3>
 <p>This vendor hasn't added any products yet</p>
 </div>
 ) : (
 <div className="card-grid">
 {products.map(product => (
 <div key={product._id} className="product-card">
 {product.image ? (
 <img src={`http://localhost:5000${product.image}`} alt={product.name} />
 ) : (
 <div style={{ width: '100%', height: 140, background: 'rgba(255,255,255,0.05)', borderRadius: 8, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-500)' }}>
 No Image
 </div>
 )}
 <h3>{product.name}</h3>
 <p className="price">Rs {product.price}/-</p>
 <button onClick={() => addToCart(product._id)} className="btn btn-primary btn-sm">
 Add to Cart
 </button>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}
