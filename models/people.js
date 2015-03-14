var mongoose = require('mongoose');

var peopleSchema = mongoose.Schema({
    name      : String,
    categories: [String],
    email     : String,
    phone     : Number,
});

module.exports = mongoose.model('people', peopleSchema);