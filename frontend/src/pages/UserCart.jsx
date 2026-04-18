import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserCart() {
 const { token } = useAuth();
 const navigate = useNavigate();
 const [cart, setCart] = useState({ items: [], grandTotal: 0 });
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');

 const headers = { Authorization: `Bearer ${token}` };

 useEffect(() => { fetchCart(); }, []);

 const fetchCart = async () => {
 try {
 const res = await axios.get('http://localhost:5000/api/user/cart', { headers });
 setCart(res.data);
 } catch (err) {
 setError('Failed to load cart');
 } finally {
 setLoading(false);
 }
 };

 const updateQuantity = async (itemId, quantity) => {
 if (quantity < 1) return;
 try {
 await axios.put(`http://localhost:5000/api/user/cart/${itemId}`, { quantity }, { headers });
 fetchCart();
 } catch (err) {
 setError('Failed to update quantity');
 }
 };

 const removeItem = async (itemId) => {
 try {
 await axios.delete(`http://localhost:5000/api/user/cart/${itemId}`, { headers });
 fetchCart();
 } catch (err) {
 setError('Failed to remove item');
 }
 };

 const deleteAll = async () => {
 if (!confirm('Delete all items from cart?')) return;
 try {
 await axios.delete('http://localhost:5000/api/user/cart', { headers });
 fetchCart();
 } catch (err) {
 setError('Failed to clear cart');
 }
 };

 if (loading) return <div className="loading"><div className="spinner"></div></div>;

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/user/vendors', label: ' View Product' },
 { to: '/user/request-items', label: ' Request Item' },
 { to: '/user/orders', label: ' Product Status' },
 ]} />
 <div className="page-content">
 <div className="section-header">Shopping Cart</div>
 {error && <div className="message error">{error}</div>}

 {!cart.items || cart.items.length === 0 ? (
 <div className="empty-state">
 <h3>Your cart is empty</h3>
 <p>Browse vendors to add items to your cart</p>
 </div>
 ) : (
 <>
 <div className="table-container">
 <table className="data-table">
 <thead>
 <tr>
 <th>Image</th>
 <th>Name</th>
 <th>Price</th>
 <th>Quantity</th>
 <th>Total Price</th>
 <th>Action</th>
 </tr>
 </thead>
 <tbody>
 {cart.items.map(item => (
 <tr key={item._id}>
 <td>
 {item.image ? (
 <img src={`http://localhost:5000${item.image}`} alt={item.name} />
 ) : (
 <div style={{ width: 50, height: 50, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}></div>
 )}
 </td>
 <td>{item.name}</td>
 <td>Rs {item.price}/-</td>
 <td>
 <select className="quantity-select" value={item.quantity}
 onChange={e => updateQuantity(item._id, parseInt(e.target.value))}>
 {[1,2,3,4,5,6,7,8,9,10].map(n => (
 <option key={n} value={n}>{n}</option>
 ))}
 </select>
 </td>
 <td>Rs {item.totalPrice}/-</td>
 <td>
 <button onClick={() => removeItem(item._id)} className="btn btn-sm btn-danger">Remove</button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 <div className="cart-total">
 <span>Grand Total: Rs {cart.grandTotal}/-</span>
 <button onClick={deleteAll} className="btn btn-danger btn-sm">Delete All</button>
 </div>

 <div className="btn-group" style={{ marginTop: '1.5rem' }}>
 <button onClick={() => navigate('/user/checkout')} className="btn btn-primary">
 Proceed to CheckOut
 </button>
 </div>
 </>
 )}
 </div>
 </div>
 );
}
