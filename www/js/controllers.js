
angular.module('starter.controllers', [])

.controller('FirstpageController', function($ionicActionSheet, $ionicPlatform, $scope, $rootScope, $timeout, 
	$localstorage, $cordovaFile, $cordovaLocalNotification, $ionicPopup, $ionicModal) {
	$ionicPlatform.ready(function(){
		updatePagePoints();

		$scope.cancelNotifications = function () {
			if(ionic.Platform.isAndroid() || ionic.Platform.isIOS())
				$cordovaLocalNotification.cancelAll();
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
				});
			}
		};

		$scope.pushNotification = function(timeGoal){
			if(ionic.Platform.isIOS() || ionic.Platform.isAndroid()){
				now = new Date().getTime(); 
				timeGoalPoint = new Date(now + 500 + timeGoal * 1000);
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
				});
			}
		}
		
	});

$scope.gamification = true;
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
$scope.hasNoCombo=true;
$scope.workMessage = "Time to start working!";
$scope.buttonText = "Start session";
$scope.buttonStyle = "button-royal";
$scope.shape = "Circle";
$scope.comboMessage = "";

$scope.borderWidth = 5;
$scope.countdown = $scope.value * 5 * $timeScale;
$scope.isDisabled = false;

$ionicModal.fromTemplateUrl('templates/success.html', {
	scope: $scope
}).then(function(succTemplate) {
	$scope.succTemplate = succTemplate;
});

$ionicModal.fromTemplateUrl('templates/lose.html', {
	scope: $scope
}).then(function(loseTemplate) {
	$scope.loseTemplate = loseTemplate;
});


$scope.closeSuccPopup = function() {
	$scope.succTemplate.hide();
};

  $scope.$on('modal.hidden', function() {
   	$scope.isDisabled = false;
   	$scope.resetClock();
   	$scope.workMessage = "Time to start working!";
	$scope.buttonText = "Start session";
	$scope.buttonStyle = "button-royal";
  });


$scope.closeLosePopup = function() {
	$scope.loseTemplate.hide();
};

$scope.showLosePopup = function() {
	$scope.loseTemplate.show();
};

$scope.showSuccPopup = function() {
	$scope.succTemplate.show();
};


//called when timer is started (from clicking activity button)
$scope.startTimer = function() {
	$scope.cancelNotifications();
	$madeItOnce = false;
	$testMode ? alert(JSON.stringify($localstorage.getData('userData'))) : "";
	$scope.pushNotification($scope.countdown);
	$scope.resetClock();
//	$scope.$broadcast('timer-start', $scope.countdown); 
	$rootScope.$broadcast('timer-start', $scope.countdown); //Sends session time goal to background service
	$localstorage.storeStartTime();
	$scope.timerRunning = true;
	$scope.workMessage = "Session active! Keep working for";
	$scope.buttonText = "Give up?";
	$scope.buttonStyle = "ion-android-hand button-assertive";
	$scope.isDisabled = true;

	
};

//called when the timer is stopped manually, i.e session failed
$scope.manualStopTimer = function (){
	$scope.cancelNotifications();
	$scope.timePassed = $localstorage.resultIncr($scope.countdown);
	$localstorage.resetCombo();
	$scope.showLosePopup();
	$scope.$broadcast('timer-stop');
	$scope.timerRunning = false;
	$scope.lastSessionStatus = false;
	$scope.comboMessage ="";
	$scope.hasNoCombo = true;

};

//When the activity button i clicked this checks if there is time left
$scope.activityButtonClicked = function(){
	if ($scope.timerRunning) {
		$scope.manualStopTimer();
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
		$madeItOnce = true;
		$localstorage.resultIncr($scope.countdown);
		$scope.lastSessionStatus = true;
		newPointsJSON = givePoints($scope.countdown);
		$scope.newPoints = newPointsJSON['points'];
		updatePagePoints();
		$rootScope.$broadcast('update-points');
		$scope.popupMessage = "";
		if(newPointsJSON['comboPoints']>=0){
			$scope.comboMessage = newPointsJSON['comboPoints'];
			$scope.hasNoCombo=false;
		}
		$scope.$apply();
		$scope.showSuccPopup();
	}
	$scope.timerRunning = false;
});

givePoints = function(timeGoal){
	if($testMode){
		time = timeGoal;
	}else{
		time = timeGoal/60;
	}
//	("Time to updatePointsLevelCombo:-> " + time);
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
	if($scope.timerRunning){
		$scope.manualStopTimer();
		$scope.pushFailNotification();
		$scope.$apply();
	}
});

$scope.$on('cordovaPauseEvent', function(event, data){
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
