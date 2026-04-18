import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    try {
      const res = await axios.post('/auth/admin/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header-bar">Event Management System</div>
        <div className="auth-title">Admin Login</div>
        <div className="auth-subtitle">Access the admin panel</div>
        {error && <div className="message error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <span className="form-label">User Id</span>
            <input type="email" className="form-input" placeholder="Admin" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-row">
            <span className="form-label">Password</span>
            <input type="password" className="form-input" placeholder="Admin" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="btn-group">
            <Link to="/" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#adb5bd', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/admin/signup" style={{ color: '#4895ef' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
