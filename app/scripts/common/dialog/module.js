(function(){
	'use strict';
	var module = angular.module('common.dialog',['ngDialog']);
	module.controller('AdvisorAddReserveDialogCtrl', ['$scope','DoDialog', function($scope, DoDialog){
		$scope.timerange = $scope.ngDialogData;
		$scope.communication_way = '顺顺在线系统';
		$scope.add = function(){
			$scope.timerange.add_reserve($scope.communication_way,function(){
				$scope.closeThisDialog();
				ApDialog.success_dialog('操作成功');
			});
		};
		$scope.toggle = function(communication_way){
			$scope.communication_way = communication_way;
		};
	}]);
	module.service('DoDialog', ['ngDialog','$rootScope',function(ngDialog, $rootScope){
		function task_state_edit_dialog(task, block){
			return ngDialog.open({
				template : 'views/global/task_state_edit_dialog.html',
				controller : 'TaskStateEditDialogCtrl',
				cache : true,
				data : {
					task :task,
					block : block
				}
			});
		}
		return {
		
		};
	}]);
})();