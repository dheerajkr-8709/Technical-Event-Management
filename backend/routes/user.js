const express = require('express');
const router = express.Router();
const { authMiddleware, userOnly } = require('../middleware/auth');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const GuestList = require('../models/GuestList');

// Get vendors by category
router.get('/vendors', authMiddleware, async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const vendors = await Vendor.find(query).select('-password');
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get vendor's products (for users to browse)
router.get('/vendors/:vendorId/products', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.params.vendorId });
    const vendor = await Vendor.findById(req.params.vendorId).select('name category');
    res.json({ products, vendor });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add to cart
router.post('/cart', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product ID is required' });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [], grandTotal: 0 });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    const qty = quantity || 1;

    if (existingItem) {
      existingItem.quantity += qty;
      existingItem.totalPrice = existingItem.price * existingItem.quantity;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        totalPrice: product.price * qty,
        image: product.image,
        vendorId: product.vendorId,
        vendorName: product.vendorName
      });
    }

    cart.grandTotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    cart.updatedAt = new Date();
    await cart.save();
    res.json({ message: 'Item added to cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get cart
router.get('/cart', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = { items: [], grandTotal: 0 };
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update cart item quantity
router.put('/cart/:itemId', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });
    item.quantity = quantity;
    item.totalPrice = item.price * quantity;
    cart.grandTotal = cart.items.reduce((sum, i) => sum + i.totalPrice, 0);
    cart.updatedAt = new Date();
    await cart.save();
    res.json({ message: 'Cart updated', cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Remove item from cart
router.delete('/cart/:itemId', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    cart.grandTotal = cart.items.reduce((sum, i) => sum + i.totalPrice, 0);
    cart.updatedAt = new Date();
    await cart.save();
    res.json({ message: 'Item removed from cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Clear cart (Delete All)
router.delete('/cart', authMiddleware, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Checkout / Place order
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const { customerName, customerEmail, customerNumber, paymentMethod, address, state, city, pinCode } = req.body;
    if (!customerName || !customerEmail || !customerNumber || !paymentMethod || !address || !state || !city || !pinCode) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    const order = new Order({
      userId: req.user.id,
      items: cart.items,
      grandTotal: cart.grandTotal,
      customerName,
      customerEmail,
      customerNumber,
      paymentMethod,
      address,
      state,
      city,
      pinCode
    });
    await order.save();
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user's orders
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Guest List - Get
router.get('/guests', authMiddleware, async (req, res) => {
  try {
    const guests = await GuestList.find({ userId: req.user.id });
    res.json(guests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Guest List - Add
router.post('/guests', authMiddleware, async (req, res) => {
  try {
    const { guestName, guestEmail, guestPhone } = req.body;
    if (!guestName) return res.status(400).json({ message: 'Guest name is required' });
    const guest = new GuestList({ userId: req.user.id, guestName, guestEmail, guestPhone });
    await guest.save();
    res.status(201).json({ message: 'Guest added successfully', guest });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Guest List - Update
router.put('/guests/:id', authMiddleware, async (req, res) => {
  try {
    const { guestName, guestEmail, guestPhone, status } = req.body;
    const guest = await GuestList.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { guestName, guestEmail, guestPhone, status },
      { new: true }
    );
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.json({ message: 'Guest updated', guest });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Guest List - Delete
router.delete('/guests/:id', authMiddleware, async (req, res) => {
  try {
    const guest = await GuestList.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.json({ message: 'Guest deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
