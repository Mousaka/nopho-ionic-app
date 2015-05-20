angular.module('starter.dataService', [])

.factory('$localstorage', ['$window', '$filter', function($window, $filter) {
	$key = 'userData';
  $defaultJSON = '{"fails": [], "succeeds": []}';
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
      timestamp = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
      data['fails'].push(timestamp);
      $setObject(data);
    },
    getData: function(){
      return $getObject();
    },
    succIncr: function() {
      data = $getObject();
      timestamp = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
      data['succeeds'].push(timestamp);
      $setObject(data);
    }
  }
}]);