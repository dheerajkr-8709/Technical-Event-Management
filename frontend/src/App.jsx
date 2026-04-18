import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Auth Pages
import IndexPage from './pages/IndexPage';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import VendorLogin from './pages/VendorLogin';
import VendorSignup from './pages/VendorSignup';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminMaintenance from './pages/AdminMaintenance';
import AddMembership from './pages/AddMembership';
import UpdateMembership from './pages/UpdateMembership';
import ManageUsers from './pages/ManageUsers';
import ManageVendors from './pages/ManageVendors';
import AdminOrders from './pages/AdminOrders';

// Vendor Pages
import VendorDashboard from './pages/VendorDashboard';
import VendorAddItem from './pages/VendorAddItem';
import VendorProducts from './pages/VendorProducts';
import VendorProductStatus from './pages/VendorProductStatus';
import VendorRequestItems from './pages/VendorRequestItems';

// User Pages
import UserDashboard from './pages/UserDashboard';
import UserVendors from './pages/UserVendors';
import UserProducts from './pages/UserProducts';
import UserCart from './pages/UserCart';
import UserCheckout from './pages/UserCheckout';
import UserGuestList from './pages/UserGuestList';
import UserOrderStatus from './pages/UserOrderStatus';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<IndexPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/vendor/login" element={<VendorLogin />} />
      <Route path="/vendor/signup" element={<VendorSignup />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/signup" element={<UserSignup />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/maintenance" element={<ProtectedRoute role="admin"><AdminMaintenance /></ProtectedRoute>} />
      <Route path="/admin/membership/add" element={<ProtectedRoute role="admin"><AddMembership /></ProtectedRoute>} />
      <Route path="/admin/membership/update" element={<ProtectedRoute role="admin"><UpdateMembership /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute>} />
      <Route path="/admin/vendors" element={<ProtectedRoute role="admin"><ManageVendors /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrders /></ProtectedRoute>} />

      {/* Vendor Routes */}
      <Route path="/vendor/dashboard" element={<ProtectedRoute role="vendor"><VendorDashboard /></ProtectedRoute>} />
      <Route path="/vendor/add-item" element={<ProtectedRoute role="vendor"><VendorAddItem /></ProtectedRoute>} />
      <Route path="/vendor/products" element={<ProtectedRoute role="vendor"><VendorProducts /></ProtectedRoute>} />
      <Route path="/vendor/product-status" element={<ProtectedRoute role="vendor"><VendorProductStatus /></ProtectedRoute>} />
      <Route path="/vendor/request-items" element={<ProtectedRoute role="vendor"><VendorRequestItems /></ProtectedRoute>} />

      {/* User Routes */}
      <Route path="/user/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
      <Route path="/user/vendors" element={<ProtectedRoute role="user"><UserVendors /></ProtectedRoute>} />
      <Route path="/user/vendors/:vendorId/products" element={<ProtectedRoute role="user"><UserProducts /></ProtectedRoute>} />
      <Route path="/user/cart" element={<ProtectedRoute role="user"><UserCart /></ProtectedRoute>} />
      <Route path="/user/checkout" element={<ProtectedRoute role="user"><UserCheckout /></ProtectedRoute>} />
      <Route path="/user/guests" element={<ProtectedRoute role="user"><UserGuestList /></ProtectedRoute>} />
      <Route path="/user/orders" element={<ProtectedRoute role="user"><UserOrderStatus /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
