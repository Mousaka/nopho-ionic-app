
function getLevelFromPoints(LL){
	return function(points){
		for(var i=0; i<LL.length; i++)
			if(points<LL[i])
				return i;
		};
	}

	angular.module('starter.filters', [])

	.constant("LL", [
		0,
		50,
		250,
		400,
		600,
		1000,
		1500,
		2200,
		3000,
		4000,
		5500,
		7000,
		10000,
		15000,
		30000,
		50000,
		100000,
		1000000000
		])



	.filter('levelCheck', getLevelFromPoints)
.filter('secondsToTime', secondsToTime)

	.factory('levelService', levelService);


	function secondsToTime(){

    return function(seconds) {
    	sec = seconds%60;
    	secTxt="";
    	if(sec < 10)
    		secTxt = "0";
    	secTxt+=sec;
        text = Math.floor(seconds/60) + ":" + secTxt;
        	return text;
    };
}
	

	function levelService (LL, $filter){
		var levelService = {};
		levelService.pointsToNextLevel = function(points){
			myLevel = $filter('levelCheck')(points);
			pointsLeft = LL[myLevel] - points;
			return pointsLeft;
		};

		levelService.getNextLevelLimit = function(points){
			myLevel = $filter('levelCheck')(points);
			pointsNextLimit = LL[myLevel] - LL[myLevel-1];
			return pointsNextLimit;
		}
		levelService.getPointsUpFromStart = function(points){
			myLevel = $filter('levelCheck')(points);
			console.log(points+"p - " + LL[myLevel] + " LL " + myLevel + " my level");
			pointsUpFromLimit = points - LL[myLevel-1];
			return pointsUpFromLimit;
		}

		return levelService;
	}




/*.filter('pointsIntervalAchieved', function () {
	return function (item) {
		$scope.pointsInterval = 0;

		if ($scope.points >=20 && <50)
			$scope.pointsInterval = 20;
		else if ($scope.points >=50 && <100)
			$scope.pointsInterval = 50;
		else if ($scope.points >=100 && <150)
			$scope.pointsInterval = 100;
		else if ($scope.points >=150 && <250)
			$scope.pointsInterval = 150;
		else if ($scope.points >=250 && <300)
			$$scope.pointsInterval = 250;
		else if ($scope.points >=300 && 350<)
			$scope.pointsInterval = 300;
		else if ($scope.points >=350 && <400)
			$scope.pointsInterval = 350;
		else if ($scope.points >=400)
			$scope.pointsInterval = 400;

		return $scope.pointsInterval;

		//Fungerar inte eftersom vi måste veta om användare precis tagit sig över poänggränsen
		//Så att detta inte sker varje gång
	};
});
*/

