(function () {

	function scorePageController($ionicActionSheet, $ionicPlatform, $scope){
		this.points = 0;
		this.level = 1
		$scope.roundProgress = {
			label: 100,
			percentage: 75
		};
	}

	angular.module('starter.score.controller', [])
	.controller('ScorePageController', scorePageController);

})();