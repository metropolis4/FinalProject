var People = require('../people.js');

People.find({}, function(err, results){
    if(results.length === 0){
        var person1 = new People({
            name: "Matt",
            roles: [
                "Guitar",
                "Drums"
            ],
            email: "me@email.com",
            phone: 7201234567
        });
        person1.save();

        var person2 = new People({
            name: "Gustave",
            roles: [
                "Saxamaphone",
                "Ukelele",
                "Drums"
            ],
            email: "Gus@email.com",
            phone: 3031234567
        });
        person2.save();
    }
});