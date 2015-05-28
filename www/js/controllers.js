angular.module('starter.controllers', [])

.controller('FirstpageController', function($ionicActionSheet, $ionicPlatform, $scope, $timeout, $localstorage, $cordovaFile) {

	$points= 0;
	$level = 1;
	$succSessionsInRow = 0;
	$totalSuccSessions = 0;
	$lastSessionStatus = false;
	$localstorage.clearData();
	$testMode = false;
	$timeScale = 60;
	$madeItOnce = false;
	$scope.data = [{a: 1, b:2}, {a:3, b:4}];
	if($testMode){
		$timeScale =
		1;
	}
	$scope.timerRunning = false;
	$scope.workMessage = "Time to start working!";
	$scope.buttonText = "Start session";
	$scope.buttonStyle = "button-positive";
	$scope.shape = "Circle";
	$scope.value = 6;
	$scope.borderWidth = 5;
	$scope.countdown = $scope.value * 5 * $timeScale;
	$scope.isDisabled = false;

//called when timer is started (from clicking activity button)
$scope.startTimer = function() {
	$madeItOnce = false;
	//alert(JSON.stringify($localstorage.getData('userData')));
	console.log("start"); 
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
	console.log("timer stopped, before if");
	if (data.seconds==0 && data.minutes==0 && !$madeItOnce){
		console.log("timer stopped, in if");
		$madeItOnce = true;
		$scope.workMessage = "Well done! You made it :)";
$scope.buttonText = "Reset timer";
$scope.buttonStyle = "button-energized";
$localstorage.resultIncr($scope.countdown);
$scope.lastSessionStatus = true;
$scope.givePoints();
$scope.$apply();
}
$scope.timerRunning = false;
});

/*$scope.givePoints = function($scope.countdown){		//anropas när man lyckas
// Nästlad switch, först på level 1,2,3,4,5 - inuti den på $scope countdown = 10-29,30-59,60-89,90-120
//	addera poäng därefter, beroende på level och klarad tid

	$scope.totalSuccSessions ++;

	if($scope.lastSessionStatus = true;)
		$scope.sessionsInRow ++;

		

	if ($scope.sessionsInRow == 3) {
		$scope.points +10;
		$sessRowMsg(3);
	}else if ($scope.sessionsInRow == 5) {
		$scope.points +30;
		$sessRowMsg(5);
		$scope.sessionsInRow = 0;
	}
}

app.filter('levelCheck', function () {
	return function (item) {
		$scope.level = 0;

		if ($scope.points >=0 && <51)
			$scope.level = 1;
		else if ($scope.points >=51 && <100)
			$scope.level = 2;
		else if ($scope.points >=100 && <150)
			$scope.level = 3;
		else if ($scope.points >=150 && <250)
			$scope.level = 4;
		else if ($scope.points >=250)
			$scope.level = 5;

		return $scope.level;
	};
});

app.filter('pointsIntervalAchieved', function () {
	return function (item) {
		$scope.pointsInterval = 0;

		if ($scope.points >=20 && <50)
			$scope.pointsInterval = 20;
		else if ($scope.points >=50 && <100)
			$scope.pointsInterval = 50;
		else if ($scope.points >=100 && <150)
			$scope.pointsInterval = 100;
		else if ($scope.points >=150 && <250)
			$scope.pointsInterval = 150;
		else if ($scope.points >=250 && <300)
			$$scope.pointsInterval = 250;
		else if ($scope.points >=300 && 350<)
			$scope.pointsInterval = 300;
		else if ($scope.points >=350 && <400)
			$scope.pointsInterval = 350;
		else if ($scope.points >=400)
			$scope.pointsInterval = 400;

		return $scope.pointsInterval;

		//Fungerar inte eftersom vi måste veta om användare precis tagit sig över poänggränsen
		//Så att detta inte sker varje gång
	};
});
*/

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
	//$scope.$apply();
});

//This event is sent on onUserLeaveHint event from Java part
$scope.$on('home-event', function(event, data){
	console.log("!! Cought home event");
	if($scope.timerRunning){
		$scope.manualStopTimer();
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
})

.controller('ScoreController', function($scope) {
	$scope.items = ["A", "List", "Of", "Items"];
});
