(function () {

function scorePageController($ionicActionSheet, $ionicPlatform, $scope){
	this.points = 0;
	this.level = 1
}

angular.module('starter.score.controller', [])
.controller('ScorePageController', scorePageController);

})();