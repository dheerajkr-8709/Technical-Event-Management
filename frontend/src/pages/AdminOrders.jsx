import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function AdminOrders() {
 const { token } = useAuth();
 const [orders, setOrders] = useState([]);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(true);

 const headers = { Authorization: `Bearer ${token}` };

 useEffect(() => { fetchOrders(); }, []);

 const fetchOrders = async () => {
 try {
 const res = await axios.get('/admin/orders', { headers });
 setOrders(res.data);
 } catch (err) {
 setError('Failed to load orders');
 } finally {
 setLoading(false);
 }
 };

 const handleStatusUpdate = async (id, status) => {
 try {
 await axios.put(`/admin/orders/${id}`, { status }, { headers });
 fetchOrders();
 } catch (err) {
 setError('Failed to update order status');
 }
 };

 const handleDelete = async (id) => {
 if (!confirm('Are you sure you want to delete this order?')) return;
 try {
 await axios.delete(`/admin/orders/${id}`, { headers });
 fetchOrders();
 } catch (err) {
 setError('Failed to delete order');
 }
 };

 if (loading) return <div className="loading"><div className="spinner"></div></div>;

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/admin/maintenance', label: ' Maintenance' },
 ]} />
 <div className="page-content">
 <div className="section-header">User Order Status</div>
 {error && <div className="message error">{error}</div>}

 {orders.length === 0 ? (
 <div className="empty-state">
 <h3>No orders yet</h3>
 <p>Orders will appear here when users place them</p>
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
 <th>Update</th>
 <th>Delete</th>
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
 order.status === 'Cancelled' ? '#ef476f' : '#ffd166'
 }}>
 {order.status}
 </span>
 </td>
 <td>
 <select className="quantity-select" value={order.status}
 onChange={e => handleStatusUpdate(order._id, e.target.value)}>
 <option value="Received">Received</option>
 <option value="Ready for Shipping">Ready for Shipping</option>
 <option value="Out for Delivery">Out for Delivery</option>
 <option value="Delivered">Delivered</option>
 <option value="Cancelled">Cancelled</option>
 </select>
 </td>
 <td>
 <button onClick={() => handleDelete(order._id)} className="btn btn-sm btn-danger">Delete</button>
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
