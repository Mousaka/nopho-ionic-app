// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var nophoApp = angular.module('starter', ['ionic', 'timer', 'angular.circular-slider', 'starter.dataService', 'starter.controllers'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    //makes the app go fullscreen
    StatusBar.hide();
    //Adding pause and resume listeners
    document.addEventListener("resume", onResume, false);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("home", onHome, false);

    //ionicPlatform.fullScreen(true);
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
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
 console.log('On Pause');
}

function onHome() {
  $rootScope.$broadcast('home-event');
  console.log('On home iii so close');
}

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
    controller: 'ScoreController'
  });

  $urlRouterProvider.otherwise('/');

});