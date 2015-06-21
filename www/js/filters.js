
function getLevelFromPoints(LL){
	return function(points){
	for(var i=0; i<LL.length; i++){
		console.log("Loop: "+i);
		if(points<LL[i])
			return i;
	}
	};
}


	function oldGetLevel(LL) {
	return function (points) {
		level = 0;
		if (points >=0 && points <50)
			level = 1;
		else if (points >=LL[2] && points <100)
			level = 2;
		else if (points >=LL[3] && points <150)
			level = 3;
		else if (points >=LL[4] && points<250)
			level = 4;
		else if (points >=LL[5])
			level = 5;

		return level;
	};
}



angular.module('starter.filters', [])

.constant("LL", [
	-1,
	50,
	150,
	250,
	400,
	])



.filter('levelCheck', getLevelFromPoints)


.factory('levelService', levelService);

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
		console.log(points+"p - " + LL[myLevel] + " LL + " + myLevel + " my level");
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

