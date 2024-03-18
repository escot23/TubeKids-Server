const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const session = new Schema({
  token: { type: String },
  usuario: { type: String },
  expira: { type: Date }
});