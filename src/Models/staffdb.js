const mongoose = require('mongoose');

const Staff = mongoose.Schema({
  Author: String,
  Total: Number,
  Male: Number,
  Female: Number
})

module.exports = mongoose.model("Staff", Staff)