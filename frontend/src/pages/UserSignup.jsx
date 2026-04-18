import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function UserSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    try {
      await axios.post('/auth/user/signup', { name, email, password });
      setSuccess('User registered successfully!');
      setTimeout(() => navigate('/user/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header-bar">Event Management System</div>
        <div className="auth-title">User Sign Up</div>
        <div className="auth-subtitle">Create your account</div>
        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <span className="form-label">Name</span>
            <input type="text" className="form-input" placeholder="User" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-row">
            <span className="form-label">Email</span>
            <input type="email" className="form-input" placeholder="User" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-row">
            <span className="form-label">Password</span>
            <input type="password" className="form-input" placeholder="User" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="btn-group">
            <Link to="/" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </div>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#adb5bd', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/user/login" style={{ color: '#4895ef' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
