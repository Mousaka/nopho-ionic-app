// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var nophoApp = angular.module('starter', ['ionic', 'ngCordova', 'ngCordova.plugins.file', 'timer', 'angular.circular-slider', 'angular-svg-round-progress', 'starter.dataService', 'starter.controllers', 'starter.score.controller', 'starter.filters','angular.directives-round-progress'])

.run(function($ionicPlatform, $ionicHistory, $ionicPopup, $rootScope, $cordovaFile, $localstorage, $cordovaSocialSharing, $cordovaLocalNotification) {
  $ionicPlatform.ready(function() {


//cancels old push notifications when the app starts
if(ionic.Platform.isAndroid() || ionic.Platform.isIOS())
  $cordovaLocalNotification.cancelAll();
console.log("Cleared PUSH NOTIFICATIONS");

    //makes the app go fullscreen
    //StatusBar.hide();
    if (ionic.Platform.isAndroid())
     ionic.Platform.fullScreen();
    //Adding pause and resume listeners
    document.addEventListener("resume", onResume, false);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("home", onHome, false);

    $cordovaFile.getFreeDiskSpace()
    .then(function (success) {
     console.log("SuccessFile");
   }, function (error) {
          // error
          console.log("FailFile");
        });

    $cordovaSocialSharing
    .canShareViaEmail()
    .then(function(result) {
      // Yes we can
    }, function(err) {
      alert("Can't send user data by email!");  
    });

/*
    $ionicPlatform.onHardwareBackButton(function(){
      navigator.notification.confirm("Closing the app will fail your current session!",
        function(buttonIndex){
         if (buttonIndex === 1 || 0){
          $localstorage.failIncr();
          navigator.app.exitApp();
        }
      },
      'Warning',
      ['Close anyway, Cancel']
      );
    });
*/

$ionicPlatform.registerBackButtonAction(function(e) {
  e.preventDefault();
  function showConfirm() {
    $ionicPopup.confirm({
      title: '<strong>Confirm</strong>',
      subTitle: '<p>Closing the app will fail any active session!</p>',
      okText: 'Ok',
      okType: 'button-positive',
      cancelText: 'Cancel'
    }).then(function(res) {
      if (res) {
        $rootScope.$broadcast('home-event');
        ionic.Platform.exitApp();
      } else {
                    // Don't close
                  }
                });
  }

        // Is there a page to go back to?
        if ($ionicHistory.backView()) {

          $ionicHistory.goBack(-1);
        } else {

            // This is the last page: Show confirmation popup
            showConfirm();
            return false;
          }
        }, 101);

if(window.cordova && window.cordova.plugins.Keyboard) {
  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
}
if(window.StatusBar) {
  StatusBar.styleDefault();
}



});

function onResume() {
 $rootScope.$broadcast('cordovaResumeEvent');
 console.log('On Resume');
}

function onPause() {
  $rootScope.$broadcast('cordovaPauseEvent');
}

function onHome() {
  $rootScope.$broadcast('home-event');
}

function alertDismissed() {
  $localstorage.failIncr();
}

})

.controller('MainController', function($scope, $ionicPlatform, $cordovaLocalNotification){
  var myService;

  $ionicPlatform.ready(function(){


    var serviceName = 'com.red_folder.phonegap.plugin.backgroundservice.nopho.NophoService';
    var factory = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService')
    myService = factory.create(serviceName);

    go();



  });

  function getStatus() {
    console.log("Gettin status...");
    myService.getStatus(function(r){updateHandler(r)}, function(e){displayError(e)});
  }

  function setConfig(goalTimeInMs){
    var jsonConf = {'goalTime': goalTimeInMs};
    console.log("app Sttings status...");
    myService.setConfiguration(jsonConf, function(r){getStatus(r)}, function(e){displayError(e)});
  }

  function displayResult(data) {
    alert("Is service running: " + data.ServiceRunning);
  }

  function displayError(data) {
    alert("We have an error " + data);
  }

  function updateHandler(data) {
    console.log("UpdatinHandler..." + data.Configuration.goalTime); //HERE IS GOALTIME
    if (data.LatestResult != null) {
      try {

       var resultMessage = document.getElementById("resultMessage");
       resultMessage.innerHTML = data.Configuration.goalTime;
     } catch (err) {
     }

   }
 }

 function go() {
   myService.getStatus(function(r){startService(r)}, function(e){displayError(e)});
 }

 function startService(data) {
   if (data.ServiceRunning) {
    enableTimer(data);
  } else {
    myService.startService(function(r){enableTimer(r)}, function(e){displayError(e)});
  }
}

function enableTimer(data) {
 if (data.TimerEnabled) {
  registerForUpdates(data);
} else {
  myService.enableTimer(60000, function(r){registerForUpdates(r)}, function(e){displayError(e)});
}

}

function registerForUpdates(data) {
 if (!data.RegisteredForUpdates) {
  myService.registerForUpdates(function(r){updateHandler(r)}, function(e){handleError(e)});
}
}


$scope.$on('timer-start', function(event, data){      
  console.log("timer-start data: " + data); 
  setConfig(data*1000);
  setInterval(function(){ getStatus(); }, 20000);
});

})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('index', {
    url: '/',
    templateUrl: 'templates/firstpage.html',
    controller: 'FirstpageController'
  })

  .state('score', {
    url: '/score',
    templateUrl: 'templates/score.html',
    controller: 'ScorePageController as sp'
  });

  $urlRouterProvider.otherwise('/');

});
