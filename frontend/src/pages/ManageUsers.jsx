import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function ManageUsers() {
 const { token } = useAuth();
 const [users, setUsers] = useState([]);
 const [showForm, setShowForm] = useState(false);
 const [editId, setEditId] = useState(null);
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');
 const [loading, setLoading] = useState(true);

 const headers = { Authorization: `Bearer ${token}` };

 useEffect(() => { fetchUsers(); }, []);

 const fetchUsers = async () => {
 try {
 const res = await axios.get('/admin/users', { headers });
 setUsers(res.data);
 } catch (err) {
 setError('Failed to load users');
 } finally {
 setLoading(false);
 }
 };

 const resetForm = () => {
 setShowForm(false); setEditId(null);
 setName(''); setEmail(''); setPassword('');
 setError(''); setSuccess('');
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError(''); setSuccess('');
 if (!name || !email || (!password && !editId)) {
 setError('All fields are required');
 return;
 }
 try {
 if (editId) {
 const data = { name, email };
 if (password) data.password = password;
 await axios.put(`/admin/users/${editId}`, data, { headers });
 setSuccess('User updated successfully');
 } else {
 await axios.post('/admin/users', { name, email, password }, { headers });
 setSuccess('User added successfully');
 }
 fetchUsers();
 setTimeout(resetForm, 1500);
 } catch (err) {
 setError(err.response?.data?.message || 'Operation failed');
 }
 };

 const handleEdit = (user) => {
 setEditId(user._id);
 setName(user.name);
 setEmail(user.email);
 setPassword('');
 setShowForm(true);
 setError(''); setSuccess('');
 };

 const handleDelete = async (id) => {
 if (!confirm('Are you sure you want to delete this user?')) return;
 try {
 await axios.delete(`/admin/users/${id}`, { headers });
 fetchUsers();
 } catch (err) {
 setError('Failed to delete user');
 }
 };

 if (loading) return <div className="loading"><div className="spinner"></div></div>;

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/admin/maintenance', label: ' Maintenance' },
 { to: '/admin/vendors', label: ' Manage Vendors' },
 ]} />
 <div className="page-content">
 <div className="section-header">User Management</div>

 <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
 <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn btn-primary">
 {showForm ? '✕ Close' : ' Add User'}
 </button>
 </div>

 {showForm && (
 <div className="auth-card" style={{ margin: '0 auto 2rem', maxWidth: '500px' }}>
 <div className="auth-title" style={{ fontSize: '1.3rem' }}>{editId ? 'Update User' : 'Add User'}</div>
 {error && <div className="message error">{error}</div>}
 {success && <div className="message success">{success}</div>}
 <form onSubmit={handleSubmit}>
 <div className="form-row">
 <span className="form-label">Name</span>
 <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} />
 </div>
 <div className="form-row">
 <span className="form-label">Email</span>
 <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
 </div>
 <div className="form-row">
 <span className="form-label">Password</span>
 <input type="password" className="form-input" placeholder={editId ? 'Leave blank to keep' : ''} value={password} onChange={e => setPassword(e.target.value)} />
 </div>
 <div className="btn-group">
 <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>
 <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Add'}</button>
 </div>
 </form>
 </div>
 )}

 <div className="table-container">
 <table className="data-table">
 <thead>
 <tr>
 <th>Name</th>
 <th>Email</th>
 <th>Created</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody>
 {users.length === 0 ? (
 <tr><td colSpan="4" style={{ textAlign: 'center' }}>No users found</td></tr>
 ) : users.map(u => (
 <tr key={u._id}>
 <td>{u.name}</td>
 <td>{u.email}</td>
 <td>{new Date(u.createdAt).toLocaleDateString()}</td>
 <td>
 <button onClick={() => handleEdit(u)} className="btn btn-sm btn-primary" style={{ marginRight: '0.5rem' }}>Update</button>
 <button onClick={() => handleDelete(u._id)} className="btn btn-sm btn-danger">Delete</button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
