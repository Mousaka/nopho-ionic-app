angular.module('starter.dataService', [])
.factory('$localstorage', ['$window', function($window) {
	$key = 'userData';
  $defaultJSON = '{"failCount": 0, "succCount": 0}';

  $getObject = function() {
    return JSON.parse($window.localStorage[$key] || $defaultJSON);
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
    },
    getData: function(){
      return $getObject();
    },

    succIncr: function() {
      data = $getObject();
      data['succCount'] = data['succCount'] + 1;
      $setObject(data);
    }
  }
}]);