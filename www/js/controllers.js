angular.module('starter.controllers', [])

.controller('FirstpageController', function($scope, $timeout, $localstorage) {
	//$localstorage.clearData();
	console.log("We");
	$testMode = true;
	$timeScale = 60;

	if($testMode){
		$timeScale =
		 1;
	}
	$scope.timerRunning = false;
	$scope.workMessage = "Time to start working!";
	$scope.buttonText = "Start session";
	$scope.buttonStyle = "button-positive";
	$scope.shape = "Half Circle";
	$scope.value = 2;
	$scope.borderWidth = 5;
	$scope.countdown = $scope.value * 5 * $timeScale;
	$scope.isDisabled = false;
//called when timer is started (from clicking activity button)
$scope.startTimer = function() {
	alert(JSON.stringify($localstorage.getData()));
	console.log("start"); 
	$scope.resetClock();
	$scope.$broadcast('timer-start');
	$scope.timerRunning = true;
	$scope.workMessage = "Keep working for";
	$scope.buttonText = "Session active";
	$scope.buttonStyle = "button-energized";
	$scope.isDisabled = true;
};

//called when the timer is stopped manually, i.e session failed
$scope.manualStopTimer = function (){
	$localstorage.failIncr();
	$scope.$broadcast('timer-stop');
	$scope.timerRunning = false;
	$scope.workMessage = "You failed your session!";
	$scope.buttonText = "Start again";
	$scope.buttonStyle = "button-assertive";
	$scope.isDisabled = false;
};

//When the activity button i clicked this checks if there is time left
$scope.activityButtonClicked = function(){
	if ($scope.timerRunning) {
		$scope.manualStopTimer();
	}else{
		$scope.startTimer();
	}
};

//resets clock time
$scope.resetClock = function() {
	if ((!$scope.timerRunning))
		$scope.$broadcast('timer-set-countdown-seconds', $scope.countdown);
};

//called when time has run out
$scope.$on('timer-stopped', function (event, data){

	$scope.timerRunning = false;
	if (data.seconds===0){
		$scope.buttonStyle = "button-balanced";
		$scope.workMessage = "Congratulations, you made it :)";
		$scope.buttonText = "Start again";
		$scope.$apply();
		console.log("Made it once");
		$localstorage.succIncr();
}

});

$scope.$on('cordovaResumeEvent', function(event, data){
	console.log("cought resume event");
});

//This event is sent on onUserLeaveHint event from Java part
$scope.$on('cordovaPauseEvent', function(event, data){
	console.log("!! Cought homeEvent event");
	$scope.manualStopTimer();
	$scope.$apply();
});

$scope.onSlide = function(value){
	console.log("det här value; " + value);
	$scope.countdown = value * $timeScale * 5;
	$scope.$broadcast('timer-set-countdown-seconds', $scope.countdown);
	$scope.value = value;
}

$scope.$on('homeEvent', function(event, data){

});

$scope.saveFail = function(){
	data = parseInt(window.localStorage.getItem("failSessions"));
	data = data + 1;
	window.localStorage.setItem("failSessions", data);
}

$scope.loadFail = function() {
	alert(window.localStorage.getItem("userData"));
}


})

.controller('ScoreController', function($scope) {
	$scope.items = ["A", "List", "Of", "Items"];
});
