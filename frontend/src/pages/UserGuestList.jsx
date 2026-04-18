import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function UserGuestList() {
 const { token } = useAuth();
 const [guests, setGuests] = useState([]);
 const [showForm, setShowForm] = useState(false);
 const [editId, setEditId] = useState(null);
 const [guestName, setGuestName] = useState('');
 const [guestEmail, setGuestEmail] = useState('');
 const [guestPhone, setGuestPhone] = useState('');
 const [status, setStatus] = useState('Pending');
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');
 const [loading, setLoading] = useState(true);

 const headers = { Authorization: `Bearer ${token}` };

 useEffect(() => { fetchGuests(); }, []);

 const fetchGuests = async () => {
 try {
 const res = await axios.get('/user/guests', { headers });
 setGuests(res.data);
 } catch (err) {
 setError('Failed to load guests');
 } finally {
 setLoading(false);
 }
 };

 const resetForm = () => {
 setShowForm(false); setEditId(null);
 setGuestName(''); setGuestEmail(''); setGuestPhone(''); setStatus('Pending');
 setError(''); setSuccess('');
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError(''); setSuccess('');
 if (!guestName) {
 setError('Guest name is required');
 return;
 }
 try {
 if (editId) {
 await axios.put(`/user/guests/${editId}`, 
 { guestName, guestEmail, guestPhone, status }, { headers });
 setSuccess('Guest updated');
 } else {
 await axios.post('/user/guests', 
 { guestName, guestEmail, guestPhone }, { headers });
 setSuccess('Guest added');
 }
 fetchGuests();
 setTimeout(resetForm, 1000);
 } catch (err) {
 setError(err.response?.data?.message || 'Operation failed');
 }
 };

 const handleEdit = (guest) => {
 setEditId(guest._id);
 setGuestName(guest.guestName);
 setGuestEmail(guest.guestEmail || '');
 setGuestPhone(guest.guestPhone || '');
 setStatus(guest.status);
 setShowForm(true);
 setError(''); setSuccess('');
 };

 const handleDelete = async (id) => {
 if (!confirm('Remove this guest?')) return;
 try {
 await axios.delete(`/user/guests/${id}`, { headers });
 fetchGuests();
 } catch (err) {
 setError('Failed to delete guest');
 }
 };

 if (loading) return <div className="loading"><div className="spinner"></div></div>;

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/user/vendors', label: ' Vendor' },
 { to: '/user/cart', label: ' Cart' },
 { to: '/user/guests', label: ' Guest List', active: true },
 { to: '/user/orders', label: ' Order Status' },
 ]} />
 <div className="page-content">
 <div className="section-header">Guest List</div>

 <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
 <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn btn-primary">
 {showForm ? '✕ Close' : ' Add Guest'}
 </button>
 </div>

 {showForm && (
 <div className="auth-card" style={{ margin: '0 auto 2rem', maxWidth: '500px' }}>
 <div className="auth-title" style={{ fontSize: '1.3rem' }}>{editId ? 'Update Guest' : 'Add Guest'}</div>
 {error && <div className="message error">{error}</div>}
 {success && <div className="message success">{success}</div>}
 <form onSubmit={handleSubmit}>
 <div className="form-row">
 <span className="form-label">Name</span>
 <input type="text" className="form-input" value={guestName} onChange={e => setGuestName(e.target.value)} />
 </div>
 <div className="form-row">
 <span className="form-label">Email</span>
 <input type="email" className="form-input" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
 </div>
 <div className="form-row">
 <span className="form-label">Phone</span>
 <input type="text" className="form-input" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} />
 </div>
 {editId && (
 <div className="form-row">
 <span className="form-label">Status</span>
 <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
 <option value="Pending">Pending</option>
 <option value="Confirmed">Confirmed</option>
 <option value="Declined">Declined</option>
 </select>
 </div>
 )}
 <div className="btn-group">
 <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>
 <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Add'}</button>
 </div>
 </form>
 </div>
 )}

 {guests.length === 0 ? (
 <div className="empty-state">
 <h3>No guests added yet</h3>
 <p>Add guests to your event list</p>
 </div>
 ) : (
 <div className="table-container">
 <table className="data-table">
 <thead>
 <tr>
 <th>Name</th>
 <th>Email</th>
 <th>Phone</th>
 <th>Status</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody>
 {guests.map(g => (
 <tr key={g._id}>
 <td>{g.guestName}</td>
 <td>{g.guestEmail || '-'}</td>
 <td>{g.guestPhone || '-'}</td>
 <td>
 <span style={{ 
 color: g.status === 'Confirmed' ? '#06d6a0' : 
 g.status === 'Declined' ? '#ef476f' : '#ffd166'
 }}>
 {g.status}
 </span>
 </td>
 <td>
 <button onClick={() => handleEdit(g)} className="btn btn-sm btn-primary" style={{ marginRight: '0.5rem' }}>Update</button>
 <button onClick={() => handleDelete(g._id)} className="btn btn-sm btn-danger">Delete</button>
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
