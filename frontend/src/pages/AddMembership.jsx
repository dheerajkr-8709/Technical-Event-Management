import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function AddMembership() {
 const { token } = useAuth();
 const [vendors, setVendors] = useState([]);
 const [vendorId, setVendorId] = useState('');
 const [duration, setDuration] = useState('6 months');
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 fetchVendors();
 }, []);

 const fetchVendors = async () => {
 try {
 const res = await axios.get('http://localhost:5000/api/admin/vendors', {
 headers: { Authorization: `Bearer ${token}` }
 });
 setVendors(res.data);
 if (res.data.length > 0) setVendorId(res.data[0]._id);
 } catch (err) {
 setError('Failed to load vendors');
 } finally {
 setLoading(false);
 }
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError(''); setSuccess('');
 if (!vendorId || !duration) {
 setError('All fields are required');
 return;
 }
 try {
 const res = await axios.post('http://localhost:5000/api/admin/membership', 
 { vendorId, membershipDuration: duration },
 { headers: { Authorization: `Bearer ${token}` } }
 );
 setSuccess(`Membership added! Number: ${res.data.membershipNumber}`);
 } catch (err) {
 setError(err.response?.data?.message || 'Failed to add membership');
 }
 };

 if (loading) return <div className="loading"><div className="spinner"></div></div>;

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/admin/maintenance', label: ' Maintenance' },
 { to: '/admin/membership/update', label: ' Update Membership' },
 ]} />
 <div className="page-content">
 <div className="section-header">Add Membership</div>
 <div className="auth-card" style={{ margin: '0 auto' }}>
 {error && <div className="message error">{error}</div>}
 {success && <div className="message success">{success}</div>}
 <form onSubmit={handleSubmit}>
 <div className="form-row">
 <span className="form-label">Vendor</span>
 <select className="form-select" value={vendorId} onChange={e => setVendorId(e.target.value)}>
 {vendors.map(v => (
 <option key={v._id} value={v._id}>{v.name} ({v.category})</option>
 ))}
 </select>
 </div>
 <div className="form-row">
 <span className="form-label">Duration</span>
 <select className="form-select" value={duration} onChange={e => setDuration(e.target.value)}>
 <option value="6 months">6 months</option>
 <option value="1 year">1 year</option>
 <option value="2 years">2 years</option>
 </select>
 </div>
 <div className="btn-group">
 <button type="submit" className="btn btn-primary">Add Membership</button>
 </div>
 </form>
 </div>
 </div>
 </div>
 );
}
