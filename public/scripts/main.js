(function () {

  angular.module('corbo', ['ngResource', 'ngRoute', 'ui.bootstrap'])

    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: '/templates/main',
          resolve    : {
            peoplecat: function (PeopleCat) { return PeopleCat.all; }
          }
        });
    })

    .directive('calendaraccordion', function () {
      return {
        restrict   : 'E',
        templateUrl: '/templates/calendarAccordion'
      };
    });

})();