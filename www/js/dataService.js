angular.module('starter.dataService', [])

.factory('$localstorage', ['$window', '$filter', '$cordovaSocialSharing', '$ionicPlatform', function($window, $filter, $cordovaSocialSharing, $ionicPlatform) {
	$key = 'userData';
  $timeStartedKey = 'startTime';
  $defaultJSON = '{"results": []}';
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
    resultIncr: function(timeGoal) {
      console.log("resultIncr");
      date = new Date();
      data = $getObject($key);
      timestamp = $filter('date')(date,'yyyy-MM-dd HH:mm:ss');
      startTime = $getStartTime();
      failTime = date.getTime();
      timePassed = failTime - startTime;
      timePassed = Math.round(timePassed / 1000);
      success = (timePassed >= timeGoal);
      data['results'].push({"startTime": timestamp, "timeGoal" : timeGoal/60, "timePassed" : Math.round(timePassed/60), "success" : success});
      $setObject($key, data);
    },
    getData: function(key){
      console.log("gettin dataaa");
      return $getObject(key);
    },
    getDataArray: function(){
      console.log("gettin array");
      data = $getObject($key);
      return data['results'];
    },

    sendDataByMail: function(){
      $ionicPlatform.ready(function() {
        console.log("MAIL time!!");
        file =$getObject($key);
        message = json2csv(file['results']);
        console.log("message: " + message);
        $cordovaSocialSharing
        .shareViaEmail(message, "My nopho data", ["krlu2271@student.su.se"], [], [], [])
        .then(function(result) {
          }, function(err) {
            alert("Email failed!");
        });
      });

    }

  }
}]);

    function json2csv(objArray)
    {
        console.log("OBjarray: "+ objArray.toString());
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if(line != '') line += ','
                    
                    line += array[i][index];
            }
            
            str += line + '\r\n';
        }
        return ""+str;
/*
        if (navigator.appName != 'Microsoft Internet Explorer')
        {
            window.open('data:text/csv;charset=utf-8,' + escape(str));
        }
        else
        {
            var popup = window.open('','csv','');
            popup.document.body.innerHTML = '<pre>' + str + '</pre>';
        }   
        */        
    }