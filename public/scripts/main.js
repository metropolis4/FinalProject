(function(){ 
var corbo = angular.module('corbo', ['ngResource', 'ngRoute', 'ui.bootstrap']);

corbo.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: '/templates/main',
            resolve: {
                peoplecat: function(PeopleCat) { return PeopleCat.all; }
            }
        });
});

corbo.factory('Events', function($resource){
    var data = {
        events: $resource('/api/event/'),
        month: ''
    };
    return {
        getMonth: function(){
            return data.month;
        },
        setMonth: function(newMonth){
            data.month = newMonth;
        },
        allEvents: function(){
            return data.events;
        },
        model: data.events,
        items: data.events.query()
    };
});

corbo.factory('Cat', function($resource){
    var model = $resource('/api/category/:id', {}, {
            show: { method: 'GET' },
            update: { method: 'PUT', params: {id: '@id'} },
            delete: { 
                        method: 'PUT', 
                        params: {
                                    id: '@id',
                                    method: 'DELETE'
                                } 
                    }
        });
    return {
        model: model,
        items: model.query()
    };
});

corbo.factory('People', function($resource){
    var model = $resource('/api/people');
    return {
        model: model,
        items: model.query()
    };
});

corbo.factory('PeopleCat', function ($q, Cat, People) {

    function calcPeopleCat(categories, people) {
        return _.map(categories, function (cat) {
            return {cat: cat, people: people};
        });
    }

    return {
        all: $q.all([Cat.items.$promise, People.items.$promise]).then(function(data){
            var categories = data[0];
            var people = data[1];
            return calcPeopleCat(categories, people);
        })
    };
}); 

corbo.controller('mainMenuController', ['$scope', '$q', 'Events', 'Cat', 'PeopleCat', '$modal', function($scope, $q, Events, Cat, PeopleCat, $modal){
    // Controlls for the 'View Month' Element
    $scope.months = [];
    var months = Events.allEvents().query(function(){
        _.map(months, function(val){
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

    $scope.toggleDropdown = function($event){
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isOpn = !$scope.status.isOpen;
    };
    $scope.isCollapsed = true;

    $scope.openNewEvent = function(){
        var modalInstance = $modal.open({
            templateUrl: '/newEvent',
            controller: 'newEventController'
        });
    };
    $scope.openManageCategories = function($event){
        var modalInstance = $modal.open({
            templateUrl: '/manageCategories',
            controller: 'manageCategoriesController'
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

corbo.controller('newEventController', ['$scope', '$q', 'Events', '$modalInstance', 'Cat', 'People', 'PeopleCat',function($scope, $q, Events, $modalInstance, Cat, People, PeopleCat){
    $scope.cancel = function(){
        $modalInstance.dismiss('cancel');
    };

    var event = getPromiseValue(PeopleCat.all);
    var keys = [];
    var values = [];
    var categoryNames = _.map(event, function(item){
        keys.push(item.cat.name);
        var midValue = [];
        _.map(item.people, function(val){
            if(_.contains(val.categories, item.cat.name)){
                midValue.push(val.name);
            }
        });
        values.push(midValue);
    });
    
    $scope.categories = [];
    var eventObjects = _.pairs(_.object(keys, values));
    eventObjects = _.map(eventObjects, function(val){
        var newObj = {};
        newObj.category = val[0];
        newObj.name = val[1];
        $scope.categories.push(newObj);
    });

    $scope.event = {};
    $scope.confirm = function(){
        var newEvent = new Events.model($scope.event);
        console.log("TEST TEST TEST:: ", newEvent);
        newEvent.$save(function(savedEvent){
            savedEvent = new Events.model(savedEvent);
            Events.items.push(savedEvent);
        });
    };
}]);

corbo.controller('manageCategoriesController', ['$scope', 'Events', '$modalInstance', 'Cat', function($scope, Events, $modalInstance, Cat){
    
    $scope.categories = Cat.items;
    $scope.category = {};
    $scope.addCategory = function(){
        var newCat = new Cat.model($scope.category);
        newCat.$save(function(savedCat){
            savedCat = new Cat.model(savedCat);
            Cat.items.push(savedCat);
        });
    };

    $scope.deleteCategory = function(selectedId){
        Cat.model.delete({id: selectedId});
        $scope.categories = _.chain(Cat.items)
                            .map(function(val){
                                if(val._id != selectedId) { return val }
                            }).compact().value();
    };

    $scope.cancel = function(){
        $modalInstance.dismiss('cancel');
    };
}]);

})();

function getPromiseValue(promise) {
    return promise.$$state.value;
}