angular.module('starter.controllers', [])

.controller('FirstpageController', function($scope, $timeout) {
	console.log("We");
	$scope.timerRunning = false;
	$scope.workMessage = "Time to start working!";
	$scope.buttonText = "Start session";
	$scope.buttonStyle = "button-positive"


//called when timer is started (from clicking activity button)
	$scope.startTimer = function() {
		console.log("start"); 
		$scope.$broadcast('timer-start');
		$scope.timerRunning = true;
		$scope.workMessage = "Keep working for";
		$scope.buttonText = "Session active";
		$scope.buttonStyle = "button-energized";
	};

//called when the timer is stopped manually, i.e session failed
	$scope.manualStopTimer = function (){
		$scope.$broadcast('timer-stop');
		$scope.timerRunning = false;
		$scope.workMessage = "You failed your session!";
		$scope.buttonText = "Start again";
		$scope.buttonStyle = "button-assertive";
	};

//When the activity button i clicked this checks if theres time left
	$scope.activityButtonClicked = function(){
		if ($scope.timerRunning) {
			$scope.manualStopTimer();
		}else{
			$scope.startTimer();
		}
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
	
})

.controller('ScoreController', function($scope) {
	$scope.items = ["A", "List", "Of", "Items"];
});
