(function(){ 
var corbo = angular.module('corbo', ['ngResource', 'ngRoute', 'ui.bootstrap']);

corbo.factory('Events', function($resource){
    var data = {
        events: $resource('/api/event/'),
        month: ''
    };
    return {
        getMonth: function() {
            return data.month;
        },
        setMonth: function(newMonth) {
            data.month = newMonth;
        },
        allEvents: function() {
            return data.events;
        }
    };
});

corbo.factory('Cat', function($resource){
    return $resource('/api/category');
});

corbo.factory('People', function($resource){
    return $resource('/api/people');
});

corbo.controller('mainMenuController', ['$scope', 'Events', '$modal', function($scope, Events, $modal){
    // Controlls for the 'View Month' Element
    $scope.months = [];
    var months = Events.allEvents().query(function(){
        months.map(function(val){
            if($scope.months.indexOf(val.date[0]) === -1)
                $scope.months.push(val.date[0]);
        });
    });
    $scope.newMonth = Events.getMonth();
    $scope.$watch('newMonth', function(newVal) {
        Events.setMonth(newVal);
    });
    $scope.changeMonth = function(){
        $scope.newMonth = this.month;
    };

    $scope.status = {
        isOpen: false
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isOpn = !$scope.status.isOpen;
    };
    $scope.isCollapsed = true;

    $scope.openNewEvent = function(){
        console.log('CLICKED');
        var modalInstance = $modal.open({
            templateUrl: '/newEvent',
            controller: 'newEventController'
        });
    };



}]);

corbo.controller('calendarController', ['$scope', 'Events', function($scope, Events){
    $scope.events = [];

    $scope.newMonth = Events.getMonth();
    $scope.$watch(function() { return Events.getMonth() }, function(newVal, oldVal) {
        if(newVal !== oldVal) {
            $scope.newMonth = newVal;
        }
        $scope.events = [];
        var allEvents = Events.allEvents().query(function(){
            allEvents.map(function(val){
                // console.log(val.date[1]);
                // _.sortBy(val, val.date[1]); 
                // console.log(val.date)
                if(val.date[0] === $scope.newMonth) {
                    $scope.events.push(val);
                }
            });
        });
    });
}]);

corbo.controller('newEventController', ['$scope', 'Events', '$modalInstance', 'Cat', 'People', function($scope, Events, $modalInstance, Cat, People){
    $scope.cancel = function(){
        $modalInstance.dismiss('cancel');
    };

    $scope.categories = [];
    Cat.query(function(cat){
        _.map(cat, function(val){
            $scope.categories.push(val.name);
        });
    });
    var makeEvent = function(){
        var finalCategory = [],
            cats          = [],
            people        = [];
        Cat.query(function(cat){
            _.map(cat, function(val){
                cats.push(val.name);
            });
        });
        People.query(function(person){
            _.map(person, function(val){
                
            })
        })
    };
    // var people = People.query(function(people){
    //     people.map
    // })
    // console.log(People.query())

    // // Controll to add a new event
    // $scope.event = {};
    // $scope.addEvent = function(){
    //     console.log(Events.allEvents().query());
    //     var newEvent = new Events.allEvents().model($scope.event);
    //     newEvent.$save(function(event){
    //         event = new Events.allEvents().model(event);
    //         Events.allEvents().query().push(event);
    //     });
    // };
}]);
})();