/**
 * @module do.sidebar
 *
 * 侧边导航栏
 */
(function(){
	'use strict';
	var module = angular.module('do.sidebar',[]);
	module.service('DoSidebar', ['$rootScope', function($rootScope){
		function changeView(view){
			$rootScope.app.curView = view;
		}
		return {
			changeView : changeView
		};
	}]);
	module.controller('DoSidebarController', ['$scope', 'DoSidebar', function($scope, sidebar){
		/**
		 * 改变主特性面板视图
		 * @param  {String} view 视图名称{'dashboard' | 'timer' | 'custom_command' | 'message' | 'music' | 'spam_protect'}
		 * @return {[type]}      [description]
		 */
		$scope.changeView = function(view){
			sidebar.changeView(view);
		};
	}]);
})();