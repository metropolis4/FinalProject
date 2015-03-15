var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
    people: [
        {
            name    : String,
            category: String
        }
    ],
    date: Date
});

module.exports = mongoose.model('events', eventSchema);