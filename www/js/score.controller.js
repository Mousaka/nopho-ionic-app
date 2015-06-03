(function () {

	function scorePageController($ionicActionSheet, $ionicPlatform, $scope, $localstorage, $filter){
		var sp = this;
		this.max = 500;
		this.current = 450;
		

		$ionicPlatform.ready(function(){
			updatePagePoints();
		});

		function updatePagePoints(){

			sp.points= $localstorage.getPoints();
			sp.level= $filter('levelCheck')(sp.points);
			sp.combo= $localstorage.getCombo();
			console.log("Antal poäng är " + sp.points);
		}

		this.getFontSize = function (){

			if (this.max > 999 || this.current > 999)
				return "17"+"px";
		} 
	}

	angular.module('starter.score.controller', [])
	.controller('ScorePageController', scorePageController);

})();