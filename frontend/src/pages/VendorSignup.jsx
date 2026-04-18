import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function VendorSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('Catering');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!name || !email || !password || !category) {
      setError('All fields are required');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/vendor/signup', { name, email, password, category });
      setSuccess('Vendor registered successfully!');
      setTimeout(() => navigate('/vendor/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header-bar">Event Management System</div>
        <div className="auth-title">Vendor Sign Up</div>
        <div className="auth-subtitle">Create a vendor account</div>
        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <span className="form-label">Name</span>
            <input type="text" className="form-input" placeholder="Vendor" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-row">
            <span className="form-label">Email</span>
            <input type="email" className="form-input" placeholder="Vendor" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-row">
            <span className="form-label">Password</span>
            <input type="password" className="form-input" placeholder="Vendor" value={password} onChange={e => setPassword(e.target.value)} />
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
            <Link to="/" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </div>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#adb5bd', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/vendor/login" style={{ color: '#4895ef' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
