(function () {

	function scorePageController($ionicActionSheet, $ionicPlatform, $scope, $localstorage, $filter, levelService){
		var sp = this;		

		$ionicPlatform.ready(function(){
			updatePagePoints();
		});

		function updatePagePoints(){

			sp.points= $localstorage.getPoints();
			sp.level= $filter('levelCheck')(sp.points);
			sp.combo= $localstorage.getCombo();
			sp.sessionCount= $localstorage.getSessionCount();
			sp.pointsLeft = levelService.pointsToNextLevel(sp.points);
			sp.max = levelService.getNextLevelLimit(sp.points);
			sp.current = levelService.getPointsUpFromStart(sp.points);
			console.log("current is" + sp.current + "max is " + sp.max);
		}

		this.getFontSize = function (){

			if (this.max > 999 || this.current > 999)
				return "17"+"px";
		} 
	}

	angular.module('starter.score.controller', [])
	.controller('ScorePageController', scorePageController);

})();