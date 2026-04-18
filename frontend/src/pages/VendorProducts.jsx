import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function VendorProducts() {
 const { token } = useAuth();
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [editId, setEditId] = useState(null);
 const [editName, setEditName] = useState('');
 const [editPrice, setEditPrice] = useState('');
 const [editImage, setEditImage] = useState(null);

 const headers = { Authorization: `Bearer ${token}` };

 useEffect(() => { fetchProducts(); }, []);

 const fetchProducts = async () => {
 try {
 const res = await axios.get('http://localhost:5000/api/vendor/products', { headers });
 setProducts(res.data);
 } catch (err) {
 setError('Failed to load products');
 } finally {
 setLoading(false);
 }
 };

 const handleDelete = async (id) => {
 if (!confirm('Delete this product?')) return;
 try {
 await axios.delete(`http://localhost:5000/api/vendor/products/${id}`, { headers });
 fetchProducts();
 } catch (err) {
 setError('Failed to delete product');
 }
 };

 const handleUpdate = async (id) => {
 try {
 const formData = new FormData();
 if (editName) formData.append('name', editName);
 if (editPrice) formData.append('price', editPrice);
 if (editImage) formData.append('image', editImage);

 await axios.put(`http://localhost:5000/api/vendor/products/${id}`, formData, {
 headers: { ...headers, 'Content-Type': 'multipart/form-data' }
 });
 setEditId(null);
 fetchProducts();
 } catch (err) {
 setError('Failed to update product');
 }
 };

 const startEdit = (product) => {
 setEditId(product._id);
 setEditName(product.name);
 setEditPrice(product.price);
 setEditImage(null);
 };

 if (loading) return <div className="loading"><div className="spinner"></div></div>;

 return (
 <div className="page-container">
 <Navbar links={[
 { to: '/vendor/products', label: ' Your Item', active: true },
 { to: '/vendor/add-item', label: ' Add New Item' },
 { to: '/vendor/product-status', label: ' Product Status' },
 { to: '/vendor/request-items', label: ' Request Item' },
 ]} />
 <div className="page-content">
 <div className="section-header">View Product</div>
 {error && <div className="message error">{error}</div>}

 {products.length === 0 ? (
 <div className="empty-state">
 <h3>No products yet</h3>
 <p>Start by adding your first product</p>
 </div>
 ) : (
 <div className="table-container">
 <table className="data-table">
 <thead>
 <tr>
 <th>Product Image</th>
 <th>Product Name</th>
 <th>Product Price</th>
 <th>Action</th>
 </tr>
 </thead>
 <tbody>
 {products.map(p => (
 <tr key={p._id}>
 <td>
 {p.image ? (
 <img src={`http://localhost:5000${p.image}`} alt={p.name} />
 ) : (
 <div style={{ width: 50, height: 50, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}></div>
 )}
 </td>
 <td>
 {editId === p._id ? (
 <input type="text" className="form-input" value={editName} onChange={e => setEditName(e.target.value)} style={{ maxWidth: '200px' }} />
 ) : p.name}
 </td>
 <td>
 {editId === p._id ? (
 <input type="number" className="form-input" value={editPrice} onChange={e => setEditPrice(e.target.value)} style={{ maxWidth: '120px' }} />
 ) : `Rs ${p.price}/-`}
 </td>
 <td>
 {editId === p._id ? (
 <>
 <input type="file" accept="image/*" onChange={e => setEditImage(e.target.files[0])} style={{ marginBottom: '0.5rem' }} />
 <button onClick={() => handleUpdate(p._id)} className="btn btn-sm btn-success" style={{ marginRight: '0.5rem' }}>Save</button>
 <button onClick={() => setEditId(null)} className="btn btn-sm btn-secondary">Cancel</button>
 </>
 ) : (
 <>
 <button onClick={() => handleDelete(p._id)} className="btn btn-sm btn-danger" style={{ marginRight: '0.5rem' }}>Delete</button>
 <button onClick={() => startEdit(p)} className="btn btn-sm btn-primary">Update</button>
 </>
 )}
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
