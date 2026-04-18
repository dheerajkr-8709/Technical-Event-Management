import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function UpdateMembership() {
 const { token } = useAuth();
 const [membershipNumber, setMembershipNumber] = useState('');
 const [vendor, setVendor] = useState(null);
 const [extensionDuration, setExtensionDuration] = useState('6 months');
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');

 const handleSearch = async () => {
 setError(''); setSuccess(''); setVendor(null);
 if (!membershipNumber.trim()) {
 setError('Membership number is required');
 return;
 }
 try {
 const res = await axios.get(`/admin/membership/${membershipNumber}`, {
 headers: { Authorization: `Bearer ${token}` }
 });
 setVendor(res.data);
 } catch (err) {
 setError(err.response?.data?.message || 'Vendor not found');
 }
 };

 const handleExtend = async () => {
 setError(''); setSuccess('');
 try {
 const res = await axios.put(`/admin/membership/${membershipNumber}`, 
 { action: 'extend', extensionDuration },
 { headers: { Authorization: `Bearer ${token}` } }
 );
 setSuccess(res.data.message);
 handleSearch();
 } catch (err) {
 setError(err.response?.data?.message || 'Failed to extend membership');
 }
 };

 const handleCancel = async () => {
 setError(''); setSuccess('');
 try {
 const res = await axios.put(`/admin/membership/${membershipNumber}`, 
 { action: 'cancel' },
 { headers: { Authorization: `Bearer ${token}` } }
 );
 setSuccess(res.data.message);
 handleSearch();
 } catch (err) {
 setError(err.response?.data?.message || 'Failed to cancel membership');
 }
 };

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/admin/maintenance', label: ' Maintenance' },
 { to: '/admin/membership/add', label: ' Add Membership' },
 ]} />
 <div className="page-content">
 <div className="section-header">Update Membership</div>
 <div className="auth-card" style={{ margin: '0 auto' }}>
 {error && <div className="message error">{error}</div>}
 {success && <div className="message success">{success}</div>}

 <div className="form-row">
 <span className="form-label">Membership #</span>
 <input type="text" className="form-input" placeholder="Enter membership number" 
 value={membershipNumber} onChange={e => setMembershipNumber(e.target.value)} />
 </div>
 <div className="btn-group">
 <button onClick={handleSearch} className="btn btn-primary">Search</button>
 </div>

 {vendor && (
 <div style={{ marginTop: '2rem' }}>
 <div className="card" style={{ marginBottom: '1.5rem' }}>
 <p><strong>Name:</strong> {vendor.name}</p>
 <p><strong>Category:</strong> {vendor.category}</p>
 <p><strong>Status:</strong> <span style={{ color: vendor.membershipStatus === 'active' ? '#06d6a0' : '#ef476f' }}>{vendor.membershipStatus}</span></p>
 <p><strong>Duration:</strong> {vendor.membershipDuration}</p>
 <p><strong>Start:</strong> {new Date(vendor.membershipStartDate).toLocaleDateString()}</p>
 <p><strong>End:</strong> {new Date(vendor.membershipEndDate).toLocaleDateString()}</p>
 </div>

 <div className="form-row">
 <span className="form-label">Extension</span>
 <select className="form-select" value={extensionDuration} onChange={e => setExtensionDuration(e.target.value)}>
 <option value="6 months">6 months</option>
 <option value="1 year">1 year</option>
 <option value="2 years">2 years</option>
 </select>
 </div>

 <div className="btn-group">
 <button onClick={handleExtend} className="btn btn-success">Extend Membership</button>
 <button onClick={handleCancel} className="btn btn-danger">Cancel Membership</button>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
