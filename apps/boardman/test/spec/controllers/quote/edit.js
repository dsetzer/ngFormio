'use strict';

describe('Controller: QuoteEditCtrl', function () {

  // load the controller's module
  beforeEach(module('boardmanApp'));

  var QuoteEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QuoteEditCtrl = $controller('QuoteEditCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
