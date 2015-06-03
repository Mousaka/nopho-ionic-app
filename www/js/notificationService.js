
	function locationService($window, $filter, $cordovaLocalNotification){

		return {
			pushNotification: function(timeGoal){
				console.log("In pushNotification");
				now = new Date().getTime(); 
				timeGoalPoint = new Date(now + timeGoal * 1000);
				console.log("Notification will scheduled at: " + timeGoalPoint + " cord: " + $cordovaLocalNotification);
				$cordovaLocalNotification.schedule({
					id: 1,
					title: 'Session completed',
					text: 'Good job! You successfully completed your session!',
					at: timeGoalPoint,
					data: {
						customProperty: 'custom value'
					}
				}).then(function (result) {
					console.log("Created new pushnotification!");
				});
			}
		}
	}

	angular.module('starter.notifications', [])

	.factory('$notifications', ['$filter', '$cordovaLocalNotification', locationService]);

