const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authMiddleware, vendorOnly } = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Multer config for product images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, fileFilter: (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) cb(null, true);
  else cb(new Error('Only image files are allowed'));
}});

// Add product (Vendor)
router.post('/products', authMiddleware, vendorOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: 'Product name and price are required' });
    }
    const product = new Product({
      vendorId: req.user.id,
      vendorName: req.user.name,
      name,
      price: parseFloat(price),
      image: req.file ? `/uploads/${req.file.filename}` : '',
      category: req.user.category
    });
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get vendor's products
router.get('/products', authMiddleware, vendorOnly, async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update product (Vendor)
router.put('/products/:id', authMiddleware, vendorOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (price) updateData.price = parseFloat(price);
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.user.id },
      updateData,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete product (Vendor)
router.delete('/products/:id', authMiddleware, vendorOnly, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, vendorId: req.user.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get vendor's orders (Product Status)
router.get('/orders', authMiddleware, vendorOnly, async (req, res) => {
  try {
    const orders = await Order.find({ 'items.vendorId': req.user.id }).populate('userId', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update order status (Vendor)
router.put('/orders/:id', authMiddleware, vendorOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Received', 'Ready for Shipping', 'Out for Delivery', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete order (Vendor)
router.delete('/orders/:id', authMiddleware, vendorOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get request items (items requested by users)
router.get('/request-items', authMiddleware, vendorOnly, async (req, res) => {
  try {
    const orders = await Order.find({ 'items.vendorId': req.user.id, status: 'Received' })
      .populate('userId', 'name email');
    const items = [];
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.vendorId && item.vendorId.toString() === req.user.id) {
          items.push({ ...item.toObject(), orderId: order._id, customerName: order.customerName, customerEmail: order.customerEmail });
        }
      });
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
