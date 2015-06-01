angular.module('starter.dataService', [])

.factory('$localstorage', ['$window', '$filter', '$cordovaSocialSharing', '$ionicPlatform', function($window, $filter, $cordovaSocialSharing, $ionicPlatform) {
	$key = 'userData';
  $scoreKey = 'score';
  $timeStartedKey = 'startTime';
  $defaultJSON = '{"results": [], "score": {"points": 0, "level": 1, "combo": 0, "achievements": []}}';

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

  $getScore = function(){
    data = $getObject($key);
    return data[$scoreKey];
  };

  $setScore = function(newScore){
    data = $getObject($key);
    data[$scoreKey] = newScore;
    $setObject($key, data);
  };


  return {

    updatePointsLevelCombo: function(time){
      data = $getScore();
        comboPoints = data['combo'] * 10;
        newPoints = time + Math.round((time*(time/10))/100)*10;
        totalNewPoints = newPoints + comboPoints;
        console.log("Score data: " + JSON.stringify(data));
        console.log("Points added: " + totalNewPoints);
        data['points'] += totalNewPoints;
        data['combo']++;
        data['level'] = $filter('levelCheck')(totalNewPoints);
        $setScore(data);
        console.log("Level stored: " + $filter('levelCheck')(totalNewPoints));
        return {points: newPoints, comboPoints: comboPoints};
    },

    getPoints: function(){
      data = $getScore();
      console.log("Score data: "+ JSON.stringify(data));
      return data['points'];
    },

    getCombo: function(){
      data = $getScore();
      return data['combo'] || -1;
    },

    addAchievement: function(newAchievement){
      score = $getScore();
      score['achievements'].push(newAchievement);
      setScore(score);
    },

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