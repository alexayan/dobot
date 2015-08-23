/**
 * @module header.controller
 */
(function(){
	var module = angular.module('header.controller', []);
	module.controller('DoHeaderController', ['$scope', 'DoUser', '$rootScope','DoAlert',function($scope, user, $rootScope, DoAlert){
		$scope.logout = function(){
			user.logout(function(user){
				$rootScope.user = null;
				DoAlert.success('登出成功');
			}, function(data){
				DoAlert.error(data.message);
			});
		};
		user.current(function(u){
			$scope.user = u;
		});
	}]);
})();