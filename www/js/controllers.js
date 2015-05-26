angular.module('starter.controllers', [])

.controller('FirstpageController', function($scope, $timeout, $localstorage) {
	$localstorage.clearData();
	$testMode = false;
	$timeScale = 60;
	$madeItOnce = false;
	$scope.data = [{a: 1, b:2}, {a:3, b:4}];
	if($testMode){
		$timeScale =
		1;
	}
	$scope.timerRunning = false;
	$scope.workMessage = "Time to start working!";
	$scope.buttonText = "Start session";
	$scope.buttonStyle = "button-positive";
	$scope.shape = "Circle";
	$scope.value = 2;
	$scope.borderWidth = 5;
	$scope.countdown = $scope.value * 5 * $timeScale;
	$scope.isDisabled = false;

//called when timer is started (from clicking activity button)
$scope.startTimer = function() {
	$madeItOnce = false;
	alert(JSON.stringify($localstorage.getData('userData')));
	console.log("start"); 
	$scope.resetClock();
	$scope.$broadcast('timer-start');
	$localstorage.storeStartTime();
	$scope.timerRunning = true;
	$scope.workMessage = "Session active! Keep working for";
	$scope.buttonText = "Give up?";
	$scope.buttonStyle = "button-assertive";
	$scope.isDisabled = true;
	
};

//called when the timer is stopped manually, i.e session failed
$scope.manualStopTimer = function (){
	console.log("manualStop");

	$localstorage.resultIncr($scope.countdown);
	$scope.$broadcast('timer-stop');
	$scope.timerRunning = false;
	$scope.workMessage = "You failed your session!";
	$scope.buttonText = "Reset timer";
	$scope.buttonStyle = "button-energized";
	
};

//When the activity button i clicked this checks if there is time left
$scope.activityButtonClicked = function(){
	if ($scope.timerRunning) {
		$scope.manualStopTimer();
	}else if ($scope.buttonText == "Reset timer"){
		$scope.resetClock();
		$scope.buttonText = "Start again";
		$scope.buttonStyle = "button-positive";
		$scope.isDisabled = false;
	}else{
		$scope.startTimer();
	}
};

broadcastTimerSet = function(time){
	$scope.$broadcast('timer-set-countdown-seconds', time);
};

//resets clock time
$scope.resetClock = function() {
	if ((!$scope.timerRunning))
		broadcastTimerSet($scope.countdown);
};

//called when time has run out
$scope.$on('timer-stopped', function (event, data){
	console.log("timer stopped, before if");
	if (data.seconds==0 && data.minutes==0 && !$madeItOnce){
		console.log("timer stopped, in if");
		$madeItOnce = true;
		$scope.workMessage = "Well done! You made it :)";
		$scope.buttonText = "Reset timer";
		$scope.buttonStyle = "button-energized";
		$localstorage.resultIncr($scope.countdown);
		$scope.$apply();
	}
	$scope.timerRunning = false;
});

$scope.$on('cordovaResumeEvent', function(event, data){
	console.log("cought resume event");
	$scope.random = Math.random();
	if($scope.timerRunning){
		$time = $scope.countdown - $localstorage.getTimeDiff();
		if($time <= 0){
			$time = 0;
		}
		broadcastTimerSet($time);
	}
	//$scope.$apply();
});

//This event is sent on onUserLeaveHint event from Java part
$scope.$on('home-event', function(event, data){
	console.log("!! Cought home event");
	if($scope.timerRunning){
		$scope.manualStopTimer();
		$scope.$apply();
	}
});

$scope.$on('cordovaPauseEvent', function(event, data){
	console.log("Pause event cought");
});

$scope.onSlide = function(value){
	$scope.countdown = value * $timeScale * 5;
	broadcastTimerSet($scope.countdown);
	$scope.value = value;
};

$scope.loadFail = function() {
	alert(window.localStorage.getItem("userData"));
};

$scope.getCSV = function () {
	console.log("gettin csv..");
	array = $localstorage.getDataArray();
	console.log("got array: " + array);
	DownloadJSON2CSV(array);
};
})

.controller('ScoreController', function($scope) {
	$scope.items = ["A", "List", "Of", "Items"];
});

    function DownloadJSON2CSV(objArray)
    {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if(line != '') line += ','
                    
                    line += array[i][index];
            }
            
            str += line + '\r\n';
        }

        if (navigator.appName != 'Microsoft Internet Explorer')
        {
            window.open('data:text/csv;charset=utf-8,' + escape(str));
        }
        else
        {
            var popup = window.open('','csv','');
            popup.document.body.innerHTML = '<pre>' + str + '</pre>';
        }           
    }

    function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}