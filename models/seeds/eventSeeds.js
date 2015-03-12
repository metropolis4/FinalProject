var Event = require('../events.js');

Event.find({}, function(err, results){
    if(results.length === 0){
        var event1 = new Event({
            people: [
                {
                    category: "Drums",
                    name: "Matt",
                    replacement: "Gustave"
                },
                {
                    category: "Ukelele",
                    name: "Gustave",
                    replacement: "Matt"
                }
            ],
            date: ['March', '15', '2015']
        });
        event1.save();
        var event2 = new Event({
            people: [
                {
                    category: "Drums",
                    name: "Matt",
                    replacement: "Gustave"
                },
                {
                    category: "Saxamaphone",
                    name: "Gustave",
                    replacement: ""
                }
            ],
            date: ['March', '22', '2015']
        });
        event2.save();
        var event3 = new Event({
            people: [
                {
                    category: "Drums",
                    name: "Matt",
                    replacement: "Gustave"
                },
                {
                    category: "Saxamaphone",
                    name: "Gustave",
                    replacement: ""
                }
            ],
            date: ['April', '14', '2015']
        });
        event3.save();
    }
});