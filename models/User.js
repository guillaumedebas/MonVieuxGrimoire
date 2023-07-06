const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, Unique: true }, //unique à définir
    password: { type: String, required: true } //hachage à réaliser
  });
  
userSchema.plugin(uniqueValidator);

  module.exports = mongoose.model('User', userSchema);