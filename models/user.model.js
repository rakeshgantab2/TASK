const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true }
  },
  {
    strict: true,
    timestamps: true
  }
);

module.exports = mongoose.model('Task.Users', UserSchema);
