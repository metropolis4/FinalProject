var mongoose = require('mongoose');

var peopleSchema = mongoose.Schema({
    name      : {
                    first: String,
                    last: String
                },
    categories: [String],
    email     : String,
    phone     : String,
});

module.exports = mongoose.model('people', peopleSchema);