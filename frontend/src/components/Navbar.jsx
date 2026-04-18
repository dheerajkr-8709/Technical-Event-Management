import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ links = [] }) {
 const { user, logout } = useAuth();
 const navigate = useNavigate();

 const handleLogout = () => {
 logout();
 navigate('/');
 };

 const homeLink = user?.role === 'admin' ? '/admin/dashboard'
 : user?.role === 'vendor' ? '/vendor/dashboard'
 : user?.role === 'user' ? '/user/dashboard' : '/';

 return (
 <nav className="navbar">
 <Link to={homeLink} className="nav-btn"> Home</Link>
 <div className="navbar-links">
 {links.map((link, i) => (
 <Link key={i} to={link.to} className={`nav-btn ${link.active ? 'active' : ''}`}>
 {link.label}
 </Link>
 ))}
 <button onClick={handleLogout} className="nav-btn logout"> LogOut</button>
 </div>
 </nav>
 );
}
