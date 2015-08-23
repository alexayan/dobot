/**
 * @module loginregister.controller
 */
(function(){
	'use strict';
	var module = angular.module('loginregister.controller',[]);
	module.controller('LoginRegisterController', ['$scope', '$modal','DoUser','DoAlert','$rootScope',function($scope, $modal, user,DoAlert,$rootScope){
		$scope.loginRegisterView = 'login';
		$scope.loginPost = {};
		$scope.registerPost = {};
		$scope.login = function(){
			user.login($scope.loginPost, function(user){
				DoAlert.success('登陆成功');
				$rootScope.user = user;
			}, function(data){
				DoAlert.error(data.message);
			});
		};
		$scope.register = function(){
			user.register($scope.registerPost, function(user){
				DoAlert.success('注册成功');
				$rootScope.user = user;
			}, function(data){
				DoAlert.error(data.message);
			});
		};
		$scope.switchLoginRegisterView = function(view){
			$scope.loginRegisterView = view;
		}
	}]);
})(); 