angular.module('starter.controllers', [])

.controller('FirstpageController', function($scope, $timeout) {

	console.log("We");
	$scope.timerRunning = false;
	$scope.timeInSec = 30 * 60;
	$scope.workMessage = "Time to start working!";
	$scope.buttonText = "Start session";
	$scope.buttonStyle = "button-positive";
	$scope.shape = "Half Circle";
	$scope.count = 0;
	$scope.value = 0;
	$scope.isHidden = false;
//called when timer is started (from clicking activity button)
$scope.startTimer = function() {
	console.log("start"); 
	$scope.resetClock();
	$scope.$broadcast('timer-start');
	$scope.timerRunning = true;
	$scope.workMessage = "Keep working for";
	$scope.buttonText = "Session active";
	$scope.buttonStyle = "button-energized";
	$scope.isHidden = true;
};

//called when the timer is stopped manually, i.e session failed
$scope.manualStopTimer = function (){
	$scope.$broadcast('timer-stop');
	$scope.timerRunning = false;
	$scope.workMessage = "You failed your session!";
	$scope.buttonText = "Start again";
	$scope.buttonStyle = "button-assertive";
	$scope.isHidden = false;
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
		$scope.$broadcast('timer-set-countdown-seconds', $scope.value);
};

//called when time has run out
$scope.$on('timer-stopped', function (event, data){

	$scope.timerRunning = false;
	if (data.seconds===0){
		$scope.buttonStyle = "button-balanced";
		$scope.workMessage = "Congratulations, you made it :)";
$scope.buttonText = "Start again";
$scope.$apply();
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
	$scope.$broadcast('timer-set-countdown-seconds', value);
	$scope.countdown = value;
	$scope.value = value;
}

$scope.$watch('countdown', function(){
	console.log("det här count; " + $scope.countdown);

});


$scope.$on('homeEvent', function(event, data){

});


})

.controller('ScoreController', function($scope) {
	$scope.items = ["A", "List", "Of", "Items"];
});
