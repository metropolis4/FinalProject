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
        events: $resource('/api/event/:id' , {}, {
            update: { method: 'PUT', params: {id: '@id'}}
        }),
        month: 'March'
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
            update: { method: 'POST', params: {id: '@id'} },
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
    var model = $resource('/api/people/:id', {}, {
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

corbo.controller('mainMenuController', ['$scope', '$q', '$filter', 'Events', 'Cat', 'PeopleCat', '$modal', function($scope, $q, $filter, Events, Cat, PeopleCat, $modal){
    // Controlls for the 'View Month' Element
    $scope.allMonths = [];
    Events.model.query(function(months){
        _.map(months, function(val){
            var justMonths = $filter('date')(val.date, 'MMMM');
            if($scope.allMonths.indexOf(justMonths) === -1){
                $scope.allMonths.push(justMonths);
            }
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
    $scope.openNewMember = function(){
        var modalInstance = $modal.open({
            templateUrl: '/newMember',
            controller: 'newMemberController'
        });
    };
    $scope.openManageCategories = function($event){
        var modalInstance = $modal.open({
            templateUrl: '/manageCategories',
            controller: 'manageCategoriesController'
        });
    };
    $scope.openViewMembers = function(){
        var modalInstance = $modal.open({
            templateUrl: '/viewMembers',
            controller: 'viewMembersController'
        });
    };
}]);

corbo.controller('viewMembersController', ['$scope', '$modalInstance', 'People', function($scope, $modalInstance, People){
    $scope.members = People.items;
    $scope.cancel = function(){
        $modalInstance.dismiss('cancel');
    };

    $scope.deletePerson = function(index, selectedId){
        People.model.delete({id: selectedId});
        $scope.members.splice(index, 1);
    };
}]);

corbo.controller('calendarController', ['$scope', '$filter', 'Events', 'People', function($scope, $filter, Events, People){
    $scope.events = [];
    var people = People.items;

    $scope.replacements = [];
    $scope.sortPeople = function(category, name){
        $scope.replacements = [];
        _.map(people, function(val){
            if(val.categories.indexOf(category) !== -1 && val.name.first !== name){
                $scope.replacements.push(val.name.first);
            }
        });
    };
    $scope.replace = function(replacement, category, event){
        var eventToUpdate = Events.model.get({id: event._id}, function(){
            _.map(eventToUpdate.people, function(val){
                if(val.category === category) {
                    val.name = replacement;
                }
            });
            eventToUpdate.$update({id: eventToUpdate._id});
        });
    };

    $scope.newMonth = Events.getMonth();
    $scope.$watch(function() { return Events.getMonth() }, function(newVal, oldVal) {
        if(newVal !== oldVal) {
            $scope.newMonth = newVal;
        }
        $scope.events = [];
        Events.model.query(function(event){
            _.map(event, function(val){
                var justMonth = $filter('date')(val.date, 'MMMM');
                if(justMonth === $scope.newMonth) {
                    $scope.events.push(val);
                }
            });
        });
    });


    $scope.toggleDropdown = function($event){
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isOpn = !$scope.status.isOpen;
    };
    $scope.isCollapsed = true;
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

    $scope.template = 'resetting';
    $scope.event = {};
    $scope.confirm = function(){
        var newEvent = new Events.model($scope.event);
        newEvent.$save(function(savedEvent){
            savedEvent = new Events.model(savedEvent);
            Events.items.push(savedEvent);
        });
        if($scope.template === 'resetting') {
            $scope.event = {};
        }
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
        $scope.category.name = '';
    };

    $scope.deleteCategory = function(index, selectedId){
        Cat.model.delete({id: selectedId});
        $scope.categories.splice(index, 1);
    };

    $scope.cancel = function(){
        $modalInstance.dismiss('cancel');
    };
}]);

corbo.controller('newMemberController', ['$scope', '$modalInstance', 'People', 'Cat', 'PeopleCat', function($scope, $modalInstance, People, Cat, PeopleCat){
    $scope.categories = Cat.items;

    $scope.newMember = {};
    $scope.confirm = function(){
        var newTeamMember = new People.model($scope.newMember);
        newTeamMember.$save(function(savedMember){
            savedMember = new People.model(savedMember);
            People.items.push(savedMember);
        });
        $scope.newMember = {};
    };
    $scope.cancel = function(){
        $modalInstance.dismiss('cancel');
    };
}]);

corbo.directive('calendaraccordion', function(){
    return {
        restrict   : 'E',
        templateUrl: '/templates/calendarAccordion'
    };
});

})();

function getPromiseValue(promise) {
    return promise.$$state.value;
}