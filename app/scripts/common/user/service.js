/**
 * @module common.user.service
 *
 */
(function(){
	'use strict';
	var module = angular.module('common.user.service',[]);
	module.service('DoUser', ['DoModel', '$rootScope',function(model, $rootScope){
		var user;
		function login(data, success, error){
			model.User.login(data, function(res){
				user = res;
				$rootScope.$broadcast('UserLogin');
				success(res);
			},function(res){
				error(res);
			});
		}
		function register(data, success, error){
			model.User.register(data, function(res){
				user = res;
				$rootScope.$broadcast('UserRegister');
				success(res);
			},function(res){
				error(res);
			});
		}
		function logout(success, error){
			if(user){
				user.logout(success, error);
				$rootScope.$broadcast('UserLogout');
				user = null;
			}
		}
		function current(success,error){
			if(user){
				success(user);
			}else{
				model.User.current(function(res){
					user = res;
					success(user);
				}, error);
			}
		}
		return {
			login : login,
			register : register,
			logout : logout,
			current : current
		};
	}]);
})(); 