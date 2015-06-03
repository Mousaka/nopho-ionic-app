
angular.module('starter.controllers', [])

.controller('FirstpageController', function($ionicActionSheet, $ionicPlatform, $scope, $timeout, 
	$localstorage, $cordovaFile, $cordovaLocalNotification, $ionicPopup, $ionicModal) {
	$ionicPlatform.ready(function(){
		updatePagePoints();

		$scope.cancelNotifications = function () {
			if(ionic.Platform.isAndroid() || ionic.Platform.isIOS())
				$cordovaLocalNotification.cancelAll();
			console.log("Cleared PUSH NOTIFICATIONS");
		};

		$scope.pushFailNotification = function () {
			if(ionic.Platform.isAndroid() || ionic.Platform.isIOS()){
				$cordovaLocalNotification.add({
					id: 2,
					title: 'Session Failed',
					text: 'You failed your session! Try again and stay focused.',
					at: 1000,
					autoCancel: true,
					data: {
						customProperty: 'custom value'
					}
				}).then(function (result) {
					console.log("Created new fail pushnotification!");
				});
			}
		};

		$scope.pushNotification = function(timeGoal){
			console.log("About to push notifciation.. android? ios? -> " +  ionic.Platform.isAndroid() + ", " + ionic.Platform.isIOS());
			if(ionic.Platform.isIOS() || ionic.Platform.isAndroid()){
				console.log("In pushNotification");
				now = new Date().getTime(); 
				timeGoalPoint = new Date(now + 500 + timeGoal * 1000);
				console.log("Notification will scheduled at: " + timeGoalPoint + " cord: " + $cordovaLocalNotification);
				$cordovaLocalNotification.add({
					id: 1,
					title: 'Session completed',
					text: 'Good job! You successfully completed your session!',
					at: timeGoalPoint,
					autoCancel: true,
					data: {
						customProperty: 'custom value'
					}
				}).then(function (result) {
					console.log("Created new pushnotification!");
				});
			}
		}
		
	});

$succSessionsInRow = 0;
$totalSuccSessions = 0;
$lastSessionStatus = false;
$testMode = true;
$timeScale = 60;
$madeItOnce = false;
$scope.value = 6;
if($testMode){
	//$localstorage.clearData();
	$timeScale =1;
	$scope.value = 2;
}
$scope.timerRunning = false;
$scope.workMessage = "Time to start working!";
$scope.buttonText = "Start session";
$scope.buttonStyle = "button-positive";
$scope.shape = "Circle";

$scope.borderWidth = 5;
$scope.countdown = $scope.value * 5 * $timeScale;
$scope.isDisabled = false;

  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

$scope.closePopup = function() {
	console.log("closing popup");
	$scope.modal.hide();
};


$scope.showPopup = function() {
	$scope.modal.show();
};

//called when timer is started (from clicking activity button)
$scope.startTimer = function() {
	$scope.cancelNotifications();
	$madeItOnce = false;
	$testMode ? alert(JSON.stringify($localstorage.getData('userData'))) : "";
	console.log("start"); 
	$scope.pushNotification($scope.countdown);
	$scope.resetClock();
	$scope.$broadcast('timer-start');
	$localstorage.storeStartTime();
	$scope.timerRunning = true;
	$scope.workMessage = "Session active! Keep working for";
	$scope.buttonText = "Give up?";
	$scope.buttonStyle = "button-assertive";
	$scope.isDisabled = true;
	
};

//called when the timer is stopped manually, i.e session failed
$scope.manualStopTimer = function (){
	console.log("manualStop");
	$scope.cancelNotifications();
	$localstorage.resultIncr($scope.countdown);
	$scope.$broadcast('timer-stop');
	$scope.timerRunning = false;
	$scope.workMessage = "You failed your session!";
	$scope.buttonText = "Reset timer";
	$scope.buttonStyle = "button-energized";
	$scope.lastSessionStatus = false;

};

//When the activity button i clicked this checks if there is time left
$scope.activityButtonClicked = function(){
	if ($scope.timerRunning) {
		$scope.manualStopTimer();
	}else if ($scope.buttonText == "Reset timer"){
		$scope.resetClock();
		$scope.buttonText = "Start again";
		$scope.buttonStyle = "button-positive";
		$scope.isDisabled = false;
	}else{
		$scope.startTimer();
	}
};

broadcastTimerSet = function(time){
	$scope.$broadcast('timer-set-countdown-seconds', time);
};

//resets clock time
$scope.resetClock = function() {
	if ((!$scope.timerRunning))
		broadcastTimerSet($scope.countdown);
};


//called when time has run out
$scope.$on('timer-stopped', function (event, data){
	//console.log("timer stopped, before if");
	if (data.seconds==0 && data.minutes==0 && !$madeItOnce){
		console.log("timer stopped, in if");
		$madeItOnce = true;
		$localstorage.resultIncr($scope.countdown);
		$scope.lastSessionStatus = true;
		newPointsJSON = givePoints($scope.countdown);
		updatePagePoints();
		$scope.workMessage = "Well done! You made it! You earned "+newPointsJSON['points'] + " points";
		if(newPointsJSON['comboPoints']>0)
			$scope.workMessage += " + " + newPointsJSON['comboPoints'] + " combo points";
		$scope.buttonText = "Reset timer";
		$scope.buttonStyle = "button-energized";
		$scope.showPopup();
		$scope.$apply();
	}
	$scope.timerRunning = false;
});

givePoints = function(timeGoal){
	if($testMode){
		time = timeGoal;
	}else{
		time = timeGoal/60;
	}
//	console.log("Time to updatePointsLevelCombo:-> " + time);
return $localstorage.updatePointsLevelCombo(time);

};

function updatePagePoints(){
	$scope.points= $localstorage.getPoints();
}


$scope.showActionSheet = function() {
	var hideSheet = $ionicActionSheet.show({
		buttons: [
		{ text: 'Export session data' },
	//	{ text: 'Get some help' }
	],
	titleText: 'NoPho menu',
	cancelText: 'Cancel',
	//	cancel: function() {
          // add cancel code..
    //  },
      buttonClicked: function(index) {	//den tar in vilken knapp som tryckts, 
      	if (index==0)					//översta knappen är 0, sen 1 osv
      		$scope.sendDataByMail();
      	else if(index==1)
      		$scope.getHelp();

      	return true;  				//true om rutan ska försvinna vid klick, annars false
      }
  });
}

$scope.$on('cordovaResumeEvent', function(event, data){
	console.log("cought resume event");
	$scope.random = Math.random();
	if($scope.timerRunning){
		$time = $scope.countdown - $localstorage.getTimeDiff();
		if($time <= 0){
			$time = 0;
		}
		broadcastTimerSet($time);
	}
});

//This event is sent on onUserLeaveHint event from Java part
$scope.$on('home-event', function(event, data){
	console.log("!! Cought home event");
	if($scope.timerRunning){
		$scope.manualStopTimer();
		$scope.pushFailNotification();
		$scope.$apply();
	}
});

$scope.$on('cordovaPauseEvent', function(event, data){
	console.log("Pause event cought");
});

$scope.onSlide = function(value){
	$scope.countdown = value * $timeScale * 5;
	broadcastTimerSet($scope.countdown);
	$scope.value = value;
};

$scope.loadFail = function() {
	alert(window.localStorage.getItem("userData"));
};

$scope.sendDataByMail = function () {
	$localstorage.sendDataByMail();
};

$ionicPlatform.ready(function () {

});

})
