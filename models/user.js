const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  phone_number: { type: String, required: true },
  priority: { type: Number, enum: [0, 1, 2], required: true }, // 0, 1, 2
});

const User = mongoose.model('User', userSchema);

module.exports = User;
