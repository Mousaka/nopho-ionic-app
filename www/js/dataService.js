angular.module('starter.dataService', [])
.factory('$localstorage', ['$window', function($window) {
	$key = 'userData';

	$getObject = function() {
		return JSON.parse($window.localStorage[$key] || '{}');
	};

	$setObject = function(value) {
      $window.localStorage[$key] = JSON.stringify(value);
    };

  return {
    get: function(defaultValue) {
      return $window.localStorage[$key] || defaultValue;
    },
    clearData: function() {
    	$window.localStorage.clear();
    },
    failIncr: function() {
      data = $getObject();
      data['failCount'] = data['failCount'] + 1;
      $setObject(data);
    }
  }
}]);