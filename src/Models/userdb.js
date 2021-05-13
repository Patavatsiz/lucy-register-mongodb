const mongoose = require('mongoose');

const User = mongoose.Schema({
  User: String,
  Name: String,
  Gender: String
})

module.exports = mongoose.model("User", User)