var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  people: [
    {
      category: String,
      name    : {
        first: String,
        last: String
      }
    }
  ],
  date   : Date,
  user_id: String
});

module.exports = mongoose.model('events', eventSchema);
