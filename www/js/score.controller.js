(function () {

	function rangeFilter(){
		return function(input, total) {
			total = parseInt(total);
			for (var i=0; i<total; i++)
				input.push(i);
			console.log("det här är combo variabel " + total);
			return input;
		};
	}

	function scorePageController($ionicActionSheet, $ionicPlatform, $scope, $rootScope, $localstorage, $filter, levelService){
		var sp = this;		

		$ionicPlatform.ready(function(){
			console.log("ionic ready");
			updatePagePoints();
		});

		$rootScope.$on('update-points', function(){
			console.log("on Update-points");
			updatePagePoints();
		});

		function updatePagePoints(){
			console.log("Updating scooore");
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
			console.log("Gettin fontsizee");
			if (this.max > 999 || this.current > 999){
				return "20px";
			}else{
				return "60px";
			}
		};

		this.getSmallerFont = function (){
			console.log("Get smaller font");
			updatePagePoints();
			return "14"+"px";
		};
	}

	angular.module('starter.score.controller', [])
	.controller('ScorePageController', scorePageController)
	.filter('range', rangeFilter);

})();