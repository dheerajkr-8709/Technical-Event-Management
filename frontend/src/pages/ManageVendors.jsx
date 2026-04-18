import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function ManageVendors() {
 const { token } = useAuth();
 const [vendors, setVendors] = useState([]);
 const [showForm, setShowForm] = useState(false);
 const [editId, setEditId] = useState(null);
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [category, setCategory] = useState('Catering');
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');
 const [loading, setLoading] = useState(true);

 const headers = { Authorization: `Bearer ${token}` };

 useEffect(() => { fetchVendors(); }, []);

 const fetchVendors = async () => {
 try {
 const res = await axios.get('http://localhost:5000/api/admin/vendors', { headers });
 setVendors(res.data);
 } catch (err) {
 setError('Failed to load vendors');
 } finally {
 setLoading(false);
 }
 };

 const resetForm = () => {
 setShowForm(false); setEditId(null);
 setName(''); setEmail(''); setPassword(''); setCategory('Catering');
 setError(''); setSuccess('');
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError(''); setSuccess('');
 if (!name || !email || (!password && !editId) || !category) {
 setError('All fields are required');
 return;
 }
 try {
 if (editId) {
 const data = { name, email, category };
 if (password) data.password = password;
 await axios.put(`http://localhost:5000/api/admin/vendors/${editId}`, data, { headers });
 setSuccess('Vendor updated successfully');
 } else {
 await axios.post('http://localhost:5000/api/admin/vendors', { name, email, password, category }, { headers });
 setSuccess('Vendor added successfully');
 }
 fetchVendors();
 setTimeout(resetForm, 1500);
 } catch (err) {
 setError(err.response?.data?.message || 'Operation failed');
 }
 };

 const handleEdit = (vendor) => {
 setEditId(vendor._id);
 setName(vendor.name);
 setEmail(vendor.email);
 setPassword('');
 setCategory(vendor.category);
 setShowForm(true);
 setError(''); setSuccess('');
 };

 const handleDelete = async (id) => {
 if (!confirm('Are you sure you want to delete this vendor?')) return;
 try {
 await axios.delete(`http://localhost:5000/api/admin/vendors/${id}`, { headers });
 fetchVendors();
 } catch (err) {
 setError('Failed to delete vendor');
 }
 };

 if (loading) return <div className="loading"><div className="spinner"></div></div>;

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/admin/maintenance', label: ' Maintenance' },
 { to: '/admin/users', label: ' Manage Users' },
 ]} />
 <div className="page-content">
 <div className="section-header">Vendor Management</div>

 <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
 <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn btn-primary">
 {showForm ? '✕ Close' : ' Add Vendor'}
 </button>
 </div>

 {showForm && (
 <div className="auth-card" style={{ margin: '0 auto 2rem', maxWidth: '500px' }}>
 <div className="auth-title" style={{ fontSize: '1.3rem' }}>{editId ? 'Update Vendor' : 'Add Vendor'}</div>
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
 <div className="form-row">
 <span className="form-label">Category</span>
 <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
 <option value="Catering">Catering</option>
 <option value="Florist">Florist</option>
 <option value="Decoration">Decoration</option>
 <option value="Lighting">Lighting</option>
 </select>
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
 <th>Category</th>
 <th>Membership</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody>
 {vendors.length === 0 ? (
 <tr><td colSpan="5" style={{ textAlign: 'center' }}>No vendors found</td></tr>
 ) : vendors.map(v => (
 <tr key={v._id}>
 <td>{v.name}</td>
 <td>{v.email}</td>
 <td>{v.category}</td>
 <td>
 <span style={{ color: v.membershipStatus === 'active' ? '#06d6a0' : '#ef476f' }}>
 {v.membershipStatus || 'inactive'}
 </span>
 </td>
 <td>
 <button onClick={() => handleEdit(v)} className="btn btn-sm btn-primary" style={{ marginRight: '0.5rem' }}>Update</button>
 <button onClick={() => handleDelete(v._id)} className="btn btn-sm btn-danger">Delete</button>
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
