var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
    people: [
        {
            category: String,
            name: String,
            replacement: String
        }
    ],
    date: [String]
});

module.exports = mongoose.model('events', eventSchema);