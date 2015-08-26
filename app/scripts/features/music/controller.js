/**
 * @module features.music.controller
 */
(function(){
	var module = angular.module('features.music.controller', []);
	module.controller('MusicPanelController', ['$scope', 'angularPlayer',function($scope, angularPlayer){
        $scope.$on('music:start', function(event, id){
        	debugger;
        	$scope.currentPlaying = angularPlayer.currentTrackData();
        })
	}]);
})();