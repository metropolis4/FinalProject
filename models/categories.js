var mongoose = require('mongoose');

var catSchema = mongoose.Schema({
  name   : String,
  user_id: String
});

module.exports = mongoose.model('category', catSchema);
