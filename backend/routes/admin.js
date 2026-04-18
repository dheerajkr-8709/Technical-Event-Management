const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');

// Get all users (Admin only)
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add user (Admin only)
router.post('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User added successfully', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update user (Admin only)
router.put('/users/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all vendors (Admin only)
router.get('/vendors', authMiddleware, adminOnly, async (req, res) => {
  try {
    const vendors = await Vendor.find().select('-password');
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add vendor (Admin only)
router.post('/vendors', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, password, category } = req.body;
    if (!name || !email || !password || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await Vendor.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Vendor already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const vendor = new Vendor({ name, email, password: hashedPassword, category });
    await vendor.save();
    res.status(201).json({ message: 'Vendor added successfully', vendor: { id: vendor._id, name: vendor.name, email: vendor.email, category: vendor.category } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update vendor (Admin only)
router.put('/vendors/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, password, category } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (category) updateData.category = category;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor updated successfully', vendor });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete vendor (Admin only)
router.delete('/vendors/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add Membership (Admin only)
router.post('/membership', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { vendorId, membershipDuration } = req.body;
    if (!vendorId || !membershipDuration) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const validDurations = ['6 months', '1 year', '2 years'];
    if (!validDurations.includes(membershipDuration)) {
      return res.status(400).json({ message: 'Invalid membership duration' });
    }
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const startDate = new Date();
    let endDate = new Date();
    if (membershipDuration === '6 months') endDate.setMonth(endDate.getMonth() + 6);
    else if (membershipDuration === '1 year') endDate.setFullYear(endDate.getFullYear() + 1);
    else if (membershipDuration === '2 years') endDate.setFullYear(endDate.getFullYear() + 2);

    const membershipNumber = 'MEM-' + Date.now().toString(36).toUpperCase();
    vendor.membershipNumber = membershipNumber;
    vendor.membershipDuration = membershipDuration;
    vendor.membershipStartDate = startDate;
    vendor.membershipEndDate = endDate;
    vendor.membershipStatus = 'active';
    await vendor.save();

    res.json({ message: 'Membership added successfully', membershipNumber, vendor: { id: vendor._id, name: vendor.name, membershipDuration, membershipStatus: 'active' } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update Membership (Admin only)
router.put('/membership/:membershipNumber', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { action, extensionDuration } = req.body;
    const vendor = await Vendor.findOne({ membershipNumber: req.params.membershipNumber });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found with this membership number' });

    if (action === 'cancel') {
      vendor.membershipStatus = 'cancelled';
      vendor.membershipEndDate = new Date();
      await vendor.save();
      return res.json({ message: 'Membership cancelled successfully', vendor: { id: vendor._id, name: vendor.name, membershipStatus: 'cancelled' } });
    }

    if (action === 'extend') {
      const duration = extensionDuration || '6 months';
      let endDate = new Date(vendor.membershipEndDate);
      if (duration === '6 months') endDate.setMonth(endDate.getMonth() + 6);
      else if (duration === '1 year') endDate.setFullYear(endDate.getFullYear() + 1);
      else if (duration === '2 years') endDate.setFullYear(endDate.getFullYear() + 2);
      vendor.membershipEndDate = endDate;
      vendor.membershipDuration = duration;
      vendor.membershipStatus = 'active';
      await vendor.save();
      return res.json({ message: 'Membership extended successfully', vendor: { id: vendor._id, name: vendor.name, membershipDuration: duration, membershipEndDate: endDate } });
    }

    res.status(400).json({ message: 'Invalid action. Use "cancel" or "extend"' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get membership by number (Admin only)
router.get('/membership/:membershipNumber', authMiddleware, adminOnly, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ membershipNumber: req.params.membershipNumber }).select('-password');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found with this membership number' });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all orders (Admin - Order Status)
router.get('/orders', authMiddleware, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update order status (Admin)
router.put('/orders/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete order (Admin)
router.delete('/orders/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
