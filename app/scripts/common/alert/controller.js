/**
 * @module common.alert.controller
 */
(function(){
	'use strict';
	var module = angular.module('common.alert.controller',['common.alert.service']);
	module.controller('DoAlertController', ['$scope', 'DoAlert', function($scope, alert){
		$scope.close = alert.close;
		$scope.alerts = alert.alerts;
	}]);
})(); 