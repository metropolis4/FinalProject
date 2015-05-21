describe('mainMenuController', function(){
    var scope;
    beforeEach(angular.mock.module('corbo'));
    beforeEcah(angular.mock.inject(function($rootscope, $controller){
        scope = $rootscope.$new();
        $controller('mainMenuController', {$scope: scope});
    }));

    it('should have a variable testing that equals "Hello"', function(){
        expect(scope.testing).toBe("Hello");
    });
});