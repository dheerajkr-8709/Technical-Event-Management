import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function VendorAddItem() {
 const { token } = useAuth();
 const [name, setName] = useState('');
 const [price, setPrice] = useState('');
 const [image, setImage] = useState(null);
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError(''); setSuccess('');
 if (!name || !price) {
 setError('Product name and price are required');
 return;
 }
 try {
 const formData = new FormData();
 formData.append('name', name);
 formData.append('price', price);
 if (image) formData.append('image', image);

 await axios.post('/vendor/products', formData, {
 headers: { 
 Authorization: `Bearer ${token}`,
 'Content-Type': 'multipart/form-data'
 }
 });
 setSuccess('Product added successfully!');
 setName(''); setPrice(''); setImage(null);
 } catch (err) {
 setError(err.response?.data?.message || 'Failed to add product');
 }
 };

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/vendor/products', label: ' Your Item' },
 { to: '/vendor/add-item', label: ' Add New Item', active: true },
 { to: '/vendor/product-status', label: ' Product Status' },
 { to: '/vendor/request-items', label: ' Request Item' },
 ]} />
 <div className="page-content">
 <div className="section-header">Add New Product</div>
 <div className="two-col-layout">
 <div className="auth-card" style={{ maxWidth: 'none' }}>
 {error && <div className="message error">{error}</div>}
 {success && <div className="message success">{success}</div>}
 <form onSubmit={handleSubmit}>
 <div className="form-group">
 <div className="form-label">Product Name</div>
 <input type="text" className="form-input" placeholder="Enter product name" value={name} onChange={e => setName(e.target.value)} />
 </div>
 <div className="form-group">
 <div className="form-label">Product Price</div>
 <input type="number" className="form-input" placeholder="Enter price" value={price} onChange={e => setPrice(e.target.value)} />
 </div>
 <div className="form-group">
 <div className="form-label">Product Image</div>
 <input type="file" className="form-input" accept="image/*" onChange={e => setImage(e.target.files[0])} />
 </div>
 <div className="btn-group">
 <button type="submit" className="btn btn-primary">Add The Product</button>
 </div>
 </form>
 </div>
 <div>
 <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
 <h3 style={{ marginBottom: '1rem', color: 'var(--gray-400)' }}>Preview</h3>
 {image ? (
 <img src={URL.createObjectURL(image)} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }} />
 ) : (
 <div style={{ width: '100%', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--gray-500)' }}>
 No image selected
 </div>
 )}
 <h3>{name || 'Product Name'}</h3>
 <p className="price" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.1rem' }}>Rs {price || '0'}/-</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
