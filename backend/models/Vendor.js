const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  category: { type: String, required: true, enum: ['Catering', 'Florist', 'Decoration', 'Lighting'] },
  contactDetails: { type: String, default: '' },
  role: { type: String, default: 'vendor' },
  membershipNumber: { type: String, default: '' },
  membershipDuration: { type: String, default: '' },
  membershipStartDate: { type: Date },
  membershipEndDate: { type: Date },
  membershipStatus: { type: String, default: 'inactive', enum: ['active', 'inactive', 'cancelled'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', vendorSchema);
