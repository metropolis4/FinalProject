(function () {

  angular.module('corbo')

    .controller('MainMenuController', ['$scope', '$q', '$filter', 'Events', '$modal',
      function ($scope, $q, $filter, Events, $modal) {
      // Controlls for the 'View Month' Element
      $scope.allMonths = [];
      Events.model.query(function (months) {
        _.map(months, function (val) {
          var justMonths = $filter('date')(val.date, 'MMMM y');
          if($scope.allMonths.indexOf(justMonths) === -1){
            $scope.allMonths.push(justMonths);
          }
        });
      });
      $scope.newMonth = Events.getMonth();
      $scope.$watch('newMonth', function (newVal, oldVal) {
        Events.setMonth(newVal);
      });
      $scope.changeMonth = function () {
        $scope.newMonth = this.month;
      };

      $scope.status = {
        isOpen: false
      };

      $scope.toggleDropdown = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isOpn = !$scope.status.isOpen;
      };
      $scope.isCollapsed = true;

      $scope.openNewEvent = function () {
        var modalInstance = $modal.open({
          templateUrl: '/newEvent',
          controller : 'NewEventController'
        });
      };
      $scope.openNewMember = function () {
        var modalInstance = $modal.open({
          templateUrl: '/newMember',
          controller : 'NewMemberController'
        });
      };
      $scope.openManageCategories = function ($event) {
        var modalInstance = $modal.open({
          templateUrl: '/manageCategories',
          controller : 'ManageCategoriesController'
        });
      };
      $scope.openViewMembers = function () {
        var modalInstance = $modal.open({
          templateUrl: '/viewMembers',
          controller : 'ViewMembersController'
        });
      };
    }])

    .controller('ViewMembersController', ['$scope', '$modalInstance', 'People',
      function ($scope, $modalInstance, People) {
      $scope.members = People.items;
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.deletePerson = function (index, selectedId) {
        People.model.delete({id: selectedId});
        $scope.members.splice(index, 1);
      };
    }])

    .controller('CalendarController', ['$scope', '$filter', 'Events', 'People',
      function ($scope, $filter, Events, People) {

      var people = People.items;
      $scope.replacements = [];

      $scope.sortPeople = function (category, name) {
        $scope.replacements = [];
        _.map(people, function (val) {
          if(val.categories.indexOf(category) !== -1 && val.name.first !== name){
            $scope.replacements.push(val);
          }
        });
      };

      $scope.allEvents = Events.items;

      $scope.replace = function (replacement, category, event, index) {
        var eventToUpdate = Events.model.get({id: event._id}, function () {
          _.map(eventToUpdate.people, function (val) {
            if(val.category === category) {
              val.name = replacement.name.first;
            }
          });
          event.people[index].name = replacement.name.first;
          eventToUpdate.$update({id: eventToUpdate._id});
        });
      };

      var filterEvents = function (event) {
        _.map(event, function (val) {
          var justMonth = $filter('date')(val.date, 'MMMM y');
          if(justMonth === $scope.newMonth) {
            $scope.events.push(val);
          }
        });
      };

      $scope.newMonth = Events.getMonth();

      $scope.$watch(function () { return Events.getMonth(); }, function (newVal, oldVal) {
        if(newVal !== oldVal) {
          $scope.newMonth = newVal;
        }
        $scope.events = [];
        filterEvents($scope.allEvents);
        console.log($scope.events[1]);
      }, true);

      $scope.toggleDropdown = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isOpn = !$scope.status.isOpen;
      };

      $scope.isCollapsed = true;
    }])

    .controller('NewEventController', ['$rootScope', '$scope', '$q', '$modalInstance', 'Events', 'PeopleCat',
      function ($rootScope, $scope, $q, $modalInstance, Events, PeopleCat) {
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      var calcPeopleCat = function (categories, people) {
        return _.map(categories, function (cat) {
          return {cat: cat, people: people};
        });
      };
      // Oh no, $rootScope! fix this later
      $rootScope.peopleCat = (function () {
        var peopleCats = PeopleCat.all.$$state.value;
        return calcPeopleCat(peopleCats[0], peopleCats[1]);
      })();

      var keys = [];
      var values = [];
      $scope.event = (function () {
      _.map($rootScope.peopleCat, function (item) {
        keys.push(item.cat.name);
        var midValue = [];
        _.map(item.people, function (val) {
          if(_.contains(val.categories, item.cat.name)){
            midValue.push(val.name);
          }
        });
        values.push(midValue);
      });
      })();

      $rootScope.categories = [];
      var eventObjects = _.pairs(_.object(keys, values));
      eventObjects = _.map(eventObjects, function (val) {
          var newObj = {};
          newObj.category = val[0];
          newObj.name = val[1];
          $scope.categories.push(newObj);
      });

      $scope.template = 'resetting';
      $scope.event = {};
      $scope.confirm = function () {
        var newEvent = new Events.model($scope.event);
        newEvent.$save(function (savedEvent) {
          savedEvent = new Events.model(savedEvent);
          Events.items.push(savedEvent);
        });
        if($scope.template === 'resetting') {
          $scope.event = {};
        }
      };
    }])

    .controller('ManageCategoriesController', ['$scope', 'Events', '$modalInstance', 'Cat',
      function ($scope, Events, $modalInstance, Cat) {

      $scope.categories = Cat.items;
      $scope.category = {};
      $scope.addCategory = function () {
        var newCat = new Cat.model($scope.category);
        newCat.$save(function (savedCat) {
          savedCat = new Cat.model(savedCat);
          Cat.items.push(savedCat);
        });
        $scope.category.name = '';
      };

      $scope.deleteCategory = function (index, selectedId) {
        Cat.model.delete({id: selectedId});
        $scope.categories.splice(index, 1);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }])

    .controller('NewMemberController', ['$scope', '$modalInstance', 'People', 'Cat',
      function ($scope, $modalInstance, People, Cat) {
      $scope.categories = Cat.items;

      $scope.newMember = {};
      $scope.confirm = function () {
        var newTeamMember = new People.model($scope.newMember);
        newTeamMember.$save(function (savedMember) {
          savedMember = new People.model(savedMember);
          People.items.push(savedMember);
        });
        $scope.newMember = {};
      };
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }]);

}).call(this);
