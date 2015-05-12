angular.module('starter.controllers', [])

.controller('FirstpageController', function($scope) {
	console.log("We");
	$scope.timerRunning = false;
	$scope.workMessage = "Time to start working!";
	$scope.buttonText = "Start session";
	$scope.buttonStyle = "button-positive"

	$scope.startTimer = function() {
		console.log("start"); 
		$scope.$broadcast('timer-start');
		$scope.timerRunning = true;
		$scope.workMessage = "Keep working for";
		$scope.buttonText = "Session active";
		$scope.buttonStyle = "button-assertive";
	};


	$scope.$on('timer-stopped', function (event, data){
		console.log('Timer Stopped - data = ', data);
		$scope.timerRunning = false;
		$scope.workMessage = "Session completed";
		$scope.style = {
			color: 'green'
		};
	});
})

.controller('ScoreController', function($scope) {
	$scope.items = ["A", "List", "Of", "Items"];
});
