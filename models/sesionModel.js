const mongoose = require('mongoose');

const sesionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expire: {
    type: Date,
    required: true,
  },
});

const Sesion = mongoose.model('Sesion', sesionSchema);

module.exports = Sesion;
