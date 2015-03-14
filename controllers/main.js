var Event  = require('../models/events.js'),
    People = require('../models/people.js'),
    Cat    = require('../models/categories.js');

var calendar = require('../public/scripts/calendar.js');
var _ = require('underscore');

var mainController = {
	main: function(req, res){
		res.render('main', {
            user: req.user
        });
	},
    newEventModal: function(req, res){
        res.render('newEvent');
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
    },
    getCategories: function(req, res){
        Cat.find({}, function(err, results){
            res.send(results);
        });
    },
    newCategory: function(req, res){
        var newCat = new Cat(req.body);
        newCat.save(function(err, results){
            res.send(results);
        });
    },
    deleteCategory: function(req, res){
        var toDelete = Cat.findById(req.body.id);
        Cat.remove(toDelete, function(err, results){
            res.sendStatus(results);
        });
    },
    manageCategoriesModal: function(req, res){
        res.render('manageCat');
    },
    getPeople: function(req, res){
        People.find({}, function(err, results){
            res.send(results);
        });
    }
};

module.exports = mainController;