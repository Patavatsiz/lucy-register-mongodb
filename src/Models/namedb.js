const mongoose = require('mongoose');

const Name = mongoose.Schema({
  User: String,
  Names: Number
})

module.exports = mongoose.model("Name", Name)