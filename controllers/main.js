var Event = require('../models/events.js');
var calendar = require('../public/scripts/calendar.js');
var _ = require('underscore');

var mainController = {
	main: function(req, res){
		res.render('main');
	},
    createEvent: function(req, res){
        console.log("REQ FROM SERVER:: ",req.body);
            // var justDates = _.chain(results)
            //     .map(function(val){
            //         return val.date;
            //     })
            //     .map(function(val){
            //         return calendar.format(val);
            //     })
            //     .value();

    },
    getEvents: function(req, res){
        Event.find({}, function(err, results){
            res.send(results);
        });
    }
};

module.exports = mainController;