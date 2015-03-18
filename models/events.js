var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
    people: [
        {
            name    : String,
            category: String
        }
    ],
    date   : Date,
    user_id: String
});

module.exports = mongoose.model('events', eventSchema);