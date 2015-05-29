(function () {

function scorePageController($ionicActionSheet, $ionicPlatform, $scope){
	this.number = 1;
}

angular.module('starter.score.controller', [])
.controller('ScorePageController', scorePageController);

})();