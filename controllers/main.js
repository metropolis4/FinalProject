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
        var event = req.body;
        var date = req.body.date;
        var people = _.chain(event)
                    .omit('date')
                    .pairs()
                    .map(function(val){
                        var name = JSON.parse(val[1]);
                        console.log("INITIAL VAL:: ", name.first);
                        var peopleObj = { name: name.first, category: val[0]};
                        console.log("PARSED?:: ", peopleObj);
                        return peopleObj;
                    })
                    .value();
        var formattedEvent = {
            people: people,
            date  : date
        };
console.log("FROM SERVER:: ", formattedEvent);
        var newEvent = new Event(formattedEvent);
        newEvent.save(function(err, results){
            if(err) throw err;
            res.send(results);
        });
    },
    getEvents: function(req, res){
        Event.find({}, function(err, results){
            if(err) throw err;
            res.send(results);
        });
    },
    getCategories: function(req, res){
        Cat.find({}, function(err, results){
            if(err) throw err;
            res.send(results);
        });
    },
    newCategory: function(req, res){
        var newCat = new Cat(req.body);
        newCat.save(function(err, results){
            if(err) throw err;
            res.send(results);
        });
    },
    deleteCategory: function(req, res){
        var toDelete = Cat.findById(req.body.id);
        Cat.remove(toDelete, function(err, results){
            if(err) throw err;
            res.sendStatus(results);
        });
    },
    manageCategoriesModal: function(req, res){
        res.render('manageCat');
    },
    getPeople: function(req, res){
        People.find({}, function(err, results){
            if(err) throw err;
            res.send(results);
        });
    },
    newMember: function(req, res){
        res.render('newMember');
    },
    createNewMember: function(req, res){
        var email = req.body.email;
        var phone = req.body.phone;
        var name = req.body.name;
        var categories = _.chain(req.body)
                        .omit(['email', 'phone', 'name'])
                        .pairs()
                        .map(function(val){
                            if(val[1]) return val[0];
                        })
                        .compact()
                        .value();
        var formattedPerson = {
            name      : name,
            categories: categories,
            email     : email,
            phone     : phone
        };
        var newPerson = new People(formattedPerson);
        console.log(newPerson);
        newPerson.save(function(err, results){
            if(err) throw err;
            res.send(results);
        });
    },
    viewMembers: function(req, res){
        res.render('viewMembers');
    }
};

module.exports = mainController;