const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guestName: { type: String, required: true },
  guestEmail: { type: String, default: '' },
  guestPhone: { type: String, default: '' },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Confirmed', 'Declined'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GuestList', guestSchema);
