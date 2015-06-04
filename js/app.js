(function(angular) {
  'use strict';
angular.module('app', ['ngAnimate'])
  .controller('ExampleController', ['$scope', function($scope) {
  	console.log("Controllin");
    $scope.templates =
      [ { name: 'index.html', url: 'www/index.html'}];
    $scope.template = $scope.templates[0];
  }]);
})(window.angular);