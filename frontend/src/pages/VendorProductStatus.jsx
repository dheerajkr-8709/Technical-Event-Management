import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function VendorProductStatus() {
 const { token } = useAuth();
 const [orders, setOrders] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [updateOrderId, setUpdateOrderId] = useState(null);
 const [selectedStatus, setSelectedStatus] = useState('Received');

 const headers = { Authorization: `Bearer ${token}` };

 useEffect(() => { fetchOrders(); }, []);

 const fetchOrders = async () => {
 try {
 const res = await axios.get('/vendor/orders', { headers });
 setOrders(res.data);
 } catch (err) {
 setError('Failed to load orders');
 } finally {
 setLoading(false);
 }
 };

 const handleStatusUpdate = async (id) => {
 try {
 await axios.put(`/vendor/orders/${id}`, { status: selectedStatus }, { headers });
 setUpdateOrderId(null);
 fetchOrders();
 } catch (err) {
 setError('Failed to update status');
 }
 };

 const handleDelete = async (id) => {
 if (!confirm('Delete this order?')) return;
 try {
 await axios.delete(`/vendor/orders/${id}`, { headers });
 fetchOrders();
 } catch (err) {
 setError('Failed to delete order');
 }
 };

 if (loading) return <div className="loading"><div className="spinner"></div></div>;

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/vendor/products', label: ' Your Item' },
 { to: '/vendor/add-item', label: ' Add New Item' },
 { to: '/vendor/product-status', label: ' Product Status', active: true },
 { to: '/vendor/request-items', label: ' Request Item' },
 ]} />
 <div className="page-content">
 <div className="section-header">Product Status</div>
 {error && <div className="message error">{error}</div>}

 {orders.length === 0 ? (
 <div className="empty-state">
 <h3>No orders yet</h3>
 <p>Orders for your products will appear here</p>
 </div>
 ) : (
 <>
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
 <td>{order.address}, {order.city}</td>
 <td>
 <span style={{ 
 color: order.status === 'Delivered' ? '#06d6a0' : 
 order.status === 'Cancelled' ? '#ef476f' : '#ffd166'
 }}>
 {order.status}
 </span>
 </td>
 <td>
 <button onClick={() => { setUpdateOrderId(order._id); setSelectedStatus(order.status); }} className="btn btn-sm btn-primary">Update</button>
 </td>
 <td>
 <button onClick={() => handleDelete(order._id)} className="btn btn-sm btn-danger">Delete</button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Update Modal */}
 {updateOrderId && (
 <div className="modal-overlay" onClick={() => setUpdateOrderId(null)}>
 <div className="modal-content" onClick={e => e.stopPropagation()}>
 <h2 style={{ color: 'var(--white)' }}>Update</h2>
 <div className="radio-group">
 {['Received', 'Ready for Shipping', 'Out for Delivery'].map(status => (
 <label key={status} className="radio-option">
 <input type="radio" name="status" value={status}
 checked={selectedStatus === status}
 onChange={e => setSelectedStatus(e.target.value)} />
 <span>{status}</span>
 </label>
 ))}
 </div>
 <div className="btn-group" style={{ marginTop: '1.5rem' }}>
 <button onClick={() => setUpdateOrderId(null)} className="btn btn-secondary">Cancel</button>
 <button onClick={() => handleStatusUpdate(updateOrderId)} className="btn btn-primary">Update</button>
 </div>
 </div>
 </div>
 )}
 </>
 )}
 </div>
 </div>
 );
}
