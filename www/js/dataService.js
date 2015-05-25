angular.module('starter.dataService', [])

.factory('$localstorage', ['$window', '$filter', function($window, $filter) {
	$key = 'userData';
  $timeStartedKey = 'startTime';
  $defaultJSON = '{"fails": [], "succeeds": []}';
  $getObject = function(key) {
    return JSON.parse($window.localStorage[key] || $defaultJSON);
  };

  $setObject = function(key, value) {
    console.log("Storing " + value + " in " + key);
    $window.localStorage[key] = JSON.stringify(value);
  };

  $getStartTime = function(){
      return $getObject($timeStartedKey);
    };

  return {
    storeStartTime: function(){
      date = new Date();
      $setObject($timeStartedKey, date.getTime());
    },
    getTimeDiff: function(){
      date = new Date();
      startTime = $getStartTime();
      dif = date.getTime()- startTime;
      res = dif / 1000;
      console.log("timeGoneSincePause: "+res + ", in ms: " + dif);
      return res || 0;
    },
    get: function(defaultValue) {
      return $window.localStorage[$key] || defaultValue;
    },
    clearData: function() {
    	$window.localStorage.clear();
    },
    failIncr: function() {
      data = $getObject($key);
      timestamp = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
      data['fails'].push(timestamp);
      $setObject($key, data);
    },
    getData: function(key){
      console.log("gettin dataaa");
      return $getObject(key);
    },
    succIncr: function() {
      data = $getObject($key);
      timestamp = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
      data['succeeds'].push(timestamp);
      $setObject($key, data);
    }
  }
}]);