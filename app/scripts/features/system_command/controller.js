/**
 * @module features.system_command.controller
 */
(function(){
	var module = angular.module('features.system_command.controller', []);
	module.controller('SystemCommandController', ['$scope', 'SystemCommandService',function($scope, scs){
		$scope.commands = scs.getSystemCommands();
		$scope.pagination = {
			currentPage : 1,
			pageNumbers : 8,
			changePageNumbers : function(num){
				this.pageNumbers = num;
			},
			pageChanged : function(){
				$scope.pageCommands = $scope.commands.slice((this.currentPage-1)*this.pageNumbers, (this.currentPage-1)*this.pageNumbers+this.pageNumbers);
			}
		};
		$scope.pagination.pageChanged();
	}]);
	module.controller('SystemCommandDetailController', ['$scope', '$modal', 'DoAlert',function($scope, $modal, DoAlert){
		if(+$scope.command.status===1){
			$scope.enabled = true;
		}else{
			$scope.enabled = false;
		}
		$scope.$watch('enabled', function(state){
			if(state){
				$scope.command.setAttr('status', '1');
				$scope.switchTooltip = '禁用';
			}else{
				$scope.command.setAttr('status', '0');
				$scope.switchTooltip = '启用';
			}
		});
	}]);
})();