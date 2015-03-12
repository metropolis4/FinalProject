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

corbo.controller('mainMenuController', ['$scope', 'Events', function($scope, Events){
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

corbo.controller('newEventController', ['$scope', 'Events', function($scope, Events){
}]);
})();