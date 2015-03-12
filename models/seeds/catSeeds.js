var Cat = require('../categories.js');

Cat.find({}, function(err, results){
    if(results.length === 0){
        var cat1 = new Cat({
            name: "Guitar"
        });
        cat1.save();
        var cat2 = new Cat({
            name: "Drums"
        });
        cat2.save();
        var cat3 = new Cat({
            name: "Saxamaphone"
        });
        cat3.save();
        var cat4 = new Cat({
            name: "Ukelele"
        });
        cat4.save();
    }
});