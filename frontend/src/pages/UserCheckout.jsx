import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserCheckout() {
 const { token } = useAuth();
 const navigate = useNavigate();
 const [cart, setCart] = useState(null);
 const [form, setForm] = useState({
 customerName: '',
 customerEmail: '',
 customerNumber: '',
 paymentMethod: 'Cash',
 address: '',
 state: '',
 city: '',
 pinCode: ''
 });
 const [error, setError] = useState('');
 const [orderSuccess, setOrderSuccess] = useState(null);
 const [loading, setLoading] = useState(true);

 const headers = { Authorization: `Bearer ${token}` };

 useEffect(() => { fetchCart(); }, []);

 const fetchCart = async () => {
 try {
 const res = await axios.get('/user/cart', { headers });
 setCart(res.data);
 if (!res.data.items || res.data.items.length === 0) {
 navigate('/user/cart');
 }
 } catch (err) {
 setError('Failed to load cart');
 } finally {
 setLoading(false);
 }
 };

 const handleChange = (e) => {
 setForm({ ...form, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError('');
 const { customerName, customerEmail, customerNumber, paymentMethod, address, state, city, pinCode } = form;
 if (!customerName || !customerEmail || !customerNumber || !paymentMethod || !address || !state || !city || !pinCode) {
 setError('All fields are required');
 return;
 }
 try {
 const res = await axios.post('/user/checkout', form, { headers });
 setOrderSuccess({ ...res.data.order, ...form });
 } catch (err) {
 setError(err.response?.data?.message || 'Checkout failed');
 }
 };

 if (loading) return <div className="loading"><div className="spinner"></div></div>;

 // Success Popup
 if (orderSuccess) {
 return (
 <div className="modal-overlay">
 <div className="modal-content">
 <h2>THANK YOU</h2>
 <div className="modal-total">
 Total Amount: Rs {orderSuccess.grandTotal}/-
 </div>
 <div className="modal-details">
 <div className="modal-detail-item">
 <div className="label">Name</div>
 <div>{form.customerName}</div>
 </div>
 <div className="modal-detail-item">
 <div className="label">Number</div>
 <div>{form.customerNumber}</div>
 </div>
 <div className="modal-detail-item">
 <div className="label">E-mail</div>
 <div>{form.customerEmail}</div>
 </div>
 <div className="modal-detail-item">
 <div className="label">Payment Method</div>
 <div>{form.paymentMethod}</div>
 </div>
 <div className="modal-detail-item">
 <div className="label">Address</div>
 <div>{form.address}</div>
 </div>
 <div className="modal-detail-item">
 <div className="label">State</div>
 <div>{form.state}</div>
 </div>
 <div className="modal-detail-item">
 <div className="label">City</div>
 <div>{form.city}</div>
 </div>
 <div className="modal-detail-item">
 <div className="label">Pin Code</div>
 <div>{form.pinCode}</div>
 </div>
 </div>
 <button onClick={() => navigate('/user/dashboard')} className="btn btn-primary">
 Continue Shopping
 </button>
 </div>
 </div>
 );
 }

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/user/cart', label: ' Cart' },
 { to: '/user/orders', label: ' Order Status' },
 ]} />
 <div className="page-content">
 {cart && (
 <div className="cart-total" style={{ marginBottom: '2rem', marginTop: 0 }}>
 <span>Item Grand Total: Rs {cart.grandTotal}/-</span>
 </div>
 )}

 <div className="section-header">Details</div>

 <div className="auth-card" style={{ margin: '0 auto', maxWidth: '600px' }}>
 {error && <div className="message error">{error}</div>}
 <form onSubmit={handleSubmit}>
 <div className="checkout-grid">
 <div className="form-group">
 <div className="form-label">Name</div>
 <input type="text" className="form-input" name="customerName" value={form.customerName} onChange={handleChange} />
 </div>
 <div className="form-group">
 <div className="form-label">Number</div>
 <input type="text" className="form-input" name="customerNumber" value={form.customerNumber} onChange={handleChange} />
 </div>
 <div className="form-group">
 <div className="form-label">E-mail</div>
 <input type="email" className="form-input" name="customerEmail" value={form.customerEmail} onChange={handleChange} />
 </div>
 <div className="form-group">
 <div className="form-label">Payment Method</div>
 <select className="form-select" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
 <option value="Cash">Cash</option>
 <option value="UPI">UPI</option>
 </select>
 </div>
 <div className="form-group">
 <div className="form-label">Address</div>
 <input type="text" className="form-input" name="address" value={form.address} onChange={handleChange} />
 </div>
 <div className="form-group">
 <div className="form-label">State</div>
 <input type="text" className="form-input" name="state" value={form.state} onChange={handleChange} />
 </div>
 <div className="form-group">
 <div className="form-label">City</div>
 <input type="text" className="form-input" name="city" value={form.city} onChange={handleChange} />
 </div>
 <div className="form-group">
 <div className="form-label">Pin Code</div>
 <input type="text" className="form-input" name="pinCode" value={form.pinCode} onChange={handleChange} />
 </div>
 </div>
 <div className="btn-group">
 <button type="submit" className="btn btn-primary">Order Now</button>
 </div>
 </form>
 </div>
 </div>
 </div>
 );
}
