(function () {

  angular.module('corbo')

    .factory('Events', function ($resource) {
      var data = {
        events: $resource('/api/event/:id' , {}, {
          update: { method: 'PUT', params: {id: '@id'}}
        }),
        month: 'Welcome Back!'
      };
      return {
        getMonth: function () {
          return data.month;
        },
        setMonth: function (newMonth) {
          data.month = newMonth;
        },
        allEvents: function () {
          return data.events;
        },
        model: data.events,
        items: data.events.query()
      };
    })

    .factory('Cat', function ($resource) {
      var model = $resource('/api/category/:id', {}, {
        show  : { method: 'GET' },
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
    })

    .factory('People', function ($resource) {
      var model = $resource('/api/people/:id', {}, {
        show  : { method: 'GET' },
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
    })

    .factory('PeopleCat', function ($q, Cat, People) {
      return {
        all: $q.all([Cat.items.$promise, People.items.$promise])
      };
    });

})();
