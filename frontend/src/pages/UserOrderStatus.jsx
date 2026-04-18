import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function UserOrderStatus() {
 const { token } = useAuth();
 const [orders, setOrders] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');

 useEffect(() => { fetchOrders(); }, []);

 const fetchOrders = async () => {
 try {
 const res = await axios.get('/user/orders', {
 headers: { Authorization: `Bearer ${token}` }
 });
 setOrders(res.data);
 } catch (err) {
 setError('Failed to load orders');
 } finally {
 setLoading(false);
 }
 };

 if (loading) return <div className="loading"><div className="spinner"></div></div>;

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/user/vendors', label: ' Vendor' },
 { to: '/user/cart', label: ' Cart' },
 { to: '/user/guests', label: ' Guest List' },
 { to: '/user/orders', label: ' Order Status', active: true },
 ]} />
 <div className="page-content">
 <div className="section-header">Order Status</div>
 {error && <div className="message error">{error}</div>}

 {orders.length === 0 ? (
 <div className="empty-state">
 <h3>No orders yet</h3>
 <p>Place your first order to see it here</p>
 </div>
 ) : (
 <div className="table-container">
 <table className="data-table">
 <thead>
 <tr>
 <th>Name</th>
 <th>E-Mail</th>
 <th>Address</th>
 <th>Status</th>
 </tr>
 </thead>
 <tbody>
 {orders.map(order => (
 <tr key={order._id}>
 <td>{order.customerName}</td>
 <td>{order.customerEmail}</td>
 <td>{order.address}, {order.city}, {order.state}</td>
 <td>
 <span style={{ 
 color: order.status === 'Delivered' ? '#06d6a0' : 
 order.status === 'Cancelled' ? '#ef476f' : '#ffd166',
 fontWeight: 600
 }}>
 {order.status}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 </div>
 );
}
