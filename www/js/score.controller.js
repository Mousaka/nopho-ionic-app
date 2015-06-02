(function () {

	function scorePageController($ionicActionSheet, $ionicPlatform, $scope, $localstorage, $filter){
		this.max = 500;
		this.current = 450;


		$ionicPlatform.ready(function(){
			updatePagePoints();
		});

		function updatePagePoints(){
			this.points= $localstorage.getPoints();
			this.level= $filter('levelCheck')(this.points);
			this.combo= $localstorage.getCombo();
			console.log(this.points);
		}

		this.getFontSize = function (){

			if (this.max > 999 || this.current > 999)
				return "17"+"px";
		} 

		/*$scope.roundProgress = {
			label: 100,
			percentage: 75
		};
		*/ //Den gamla progress bar'en
	}

	angular.module('starter.score.controller', [])
	.controller('ScorePageController', scorePageController);

})();