const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./models/Admin');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Cart = require('./models/Cart');
const GuestList = require('./models/GuestList');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/event_management';

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing data
    console.log('Clearing old data...');
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await GuestList.deleteMany({});

    console.log('Generating seed data...');

    const defaultPassword = await bcrypt.hash('password123', 10);

    // 1. Create Admin
    const admin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@event.com',
      password: defaultPassword
    });

    // 2. Create Users
    const user1 = await User.create({
      name: 'John Doe',
      email: 'user1@event.com',
      password: defaultPassword
    });
    
    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'user2@event.com',
      password: defaultPassword
    });

    // 3. Create Vendors
    const vendor1 = await Vendor.create({
      name: 'Spice Route Catering',
      email: 'vendor1@event.com',
      password: defaultPassword,
      category: 'Catering',
      membershipStatus: 'active',
      membershipDuration: '1 year',
      membershipStartDate: new Date(),
      membershipEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      membershipNumber: 'MEMB-' + Math.floor(100000 + Math.random() * 900000)
    });

    const vendor2 = await Vendor.create({
      name: 'Blooming Petals',
      email: 'vendor2@event.com',
      password: defaultPassword,
      category: 'Florist',
      membershipStatus: 'active',
      membershipDuration: '6 months',
      membershipStartDate: new Date(),
      membershipEndDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      membershipNumber: 'MEMB-' + Math.floor(100000 + Math.random() * 900000)
    });

    const vendor3 = await Vendor.create({
      name: 'Majestic Decorators',
      email: 'vendor3@event.com',
      password: defaultPassword,
      category: 'Decoration',
      membershipStatus: 'inactive'
    });

    const vendor4 = await Vendor.create({
      name: 'Luminous Event Lighting',
      email: 'vendor4@event.com',
      password: defaultPassword,
      category: 'Lighting',
      membershipStatus: 'active',
      membershipDuration: '2 years',
      membershipStartDate: new Date(),
      membershipEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
      membershipNumber: 'MEMB-' + Math.floor(100000 + Math.random() * 900000)
    });

    // 4. Create Products
    const prod1 = await Product.create({
      vendorId: vendor1._id,
      vendorName: vendor1.name,
      category: vendor1.category,
      name: 'Premium Buffet Package',
      price: 1500,
      image: ''
    });

    const prod2 = await Product.create({
      vendorId: vendor1._id,
      vendorName: vendor1.name,
      category: vendor1.category,
      name: 'Standard Dinner Menu',
      price: 800,
      image: ''
    });

    const prod3 = await Product.create({
      vendorId: vendor2._id,
      vendorName: vendor2.name,
      category: vendor2.category,
      name: 'Rose & Lily Centerpieces',
      price: 2500,
      image: ''
    });

    const prod4 = await Product.create({
      vendorId: vendor2._id,
      vendorName: vendor2.name,
      category: vendor2.category,
      name: 'Bridal Bouquet',
      price: 1200,
      image: ''
    });

    const prod5 = await Product.create({
      vendorId: vendor4._id,
      vendorName: vendor4.name,
      category: vendor4.category,
      name: 'Fairy Light Canopy',
      price: 5000,
      image: ''
    });

    // 5. Create Cart for User 1
    const cartItems = [
      {
        productId: prod1._id,
        vendorId: vendor1._id,
        vendorName: vendor1.name,
        name: prod1.name,
        price: prod1.price,
        quantity: 2,
        totalPrice: prod1.price * 2,
        image: prod1.image
      },
      {
        productId: prod3._id,
        vendorId: vendor2._id,
        vendorName: vendor2.name,
        name: prod3.name,
        price: prod3.price,
        quantity: 1,
        totalPrice: prod3.price * 1,
        image: prod3.image
      }
    ];

    await Cart.create({
      userId: user1._id,
      items: cartItems,
      grandTotal: (prod1.price * 2) + (prod3.price * 1)
    });

    // 6. Create Order for User 2
    await Order.create({
      userId: user2._id,
      customerName: user2.name,
      customerEmail: user2.email,
      customerNumber: '9876543210',
      paymentMethod: 'UPI',
      address: '123 Event Street',
      state: 'Maharashtra',
      city: 'Mumbai',
      pinCode: '400001',
      items: [{
        productId: prod2._id,
        vendorId: vendor1._id,
        name: prod2.name,
        price: prod2.price,
        quantity: 5,
        totalPrice: prod2.price * 5,
        image: prod2.image
      }],
      grandTotal: prod2.price * 5,
      status: 'Received'
    });

    // 7. Create Guest List for User 1
    await GuestList.create({
      userId: user1._id,
      guestName: 'Albert Einstein',
      guestEmail: 'albert@physics.org',
      guestPhone: '555-0101',
      status: 'Confirmed'
    });

    await GuestList.create({
      userId: user1._id,
      guestName: 'Marie Curie',
      guestEmail: 'marie@science.com',
      guestPhone: '555-0202',
      status: 'Pending'
    });

    console.log('\n✅ Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('Login Credentials (All passwords are "password123"):');
    console.log('Admin:       admin@event.com');
    console.log('User 1:      user1@event.com');
    console.log('User 2:      user2@event.com');
    console.log('Vendor 1:    vendor1@event.com (Catering)');
    console.log('Vendor 2:    vendor2@event.com (Florist)');
    console.log('Vendor 3:    vendor3@event.com (Decoration - Inactive)');
    console.log('Vendor 4:    vendor4@event.com (Lighting)');
    console.log('----------------------------------------------------\n');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedData();
