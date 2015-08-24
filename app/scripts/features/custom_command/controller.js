/**
 * @module features.custom_command.controller
 */
(function(){
	var module = angular.module('features.custom_command.controller', []);
	module.controller('CustomCommandController', ['$scope', 'CustomCommandService', '$filter', '$modal', 'DoAlert','$rootScope', function($scope, ccs, $filter, $modal, DoAlert, $rootScope){
		$scope.query = '';
		$scope.pagination = {
			currentPage : 1,
			pageNumbers : 8,
			changePageNumbers : function(num){
				this.pageNumbers = num;
			},
			pageChanged : function(){
				var q = $scope.query;
				$scope.tempCommands = $filter('filter')($scope.commands, function(value){
					var statusDescript, authDescript;
					if(value.name.indexOf(q)!==-1){
						return true;
					}
					if(value.response.indexOf(q)!==-1){
						return true;
					}
					if(+(value.status)===1){
						statusDescript = '启用';
					}else{
						statusDescript = '禁用';
					}
					if((+value.auth)===1){
						authDescript = '所有人'
					}else{
						authDescript = '主播';
					}
					if(statusDescript.indexOf(q)!==-1){
						return true;
					}
					if(authDescript.indexOf(q)!==-1){
						return true;
					}
				});
				$scope.pageCommands = $scope.tempCommands.slice((this.currentPage-1)*this.pageNumbers, (this.currentPage-1)*this.pageNumbers+this.pageNumbers);
			}
		};
		$scope.$watch('query', function(q){
			if($scope.commands!==undefined){
				$scope.pagination.pageChanged();
			}
		});
		$scope.$on('CommandsChange', function(){
			$scope.pagination.pageChanged();
		});
		$scope.pageCommands = [];
		ccs.getCommands(function(res){
			$scope.commands = $scope.tempCommands = res;
			$scope.pagination.pageChanged();
		}, function(data){
			DoAlert.error(data.message);
		});
		$scope.newCommand = function(){
			var modalInstance = $modal.open({
		      animation: true,
		      templateUrl: '../app/scripts/features/custom_command/templates/custom_command_modal.tpl.html',
		      controller: 'CustomCommandModalController',
		      keyboard : false,
		      resolve : {
		      	command : function(){
		      		return null;
		      	}
		      }
		    });

		    modalInstance.result.then(function (command) {
		      DoAlert.success('创建指令成功');
		    }, function(data){
		      
		    });
		};
		$scope.deleteCommand = function(command){
			var modalInstance = $modal.open({
		      animation: true,
		      templateUrl: '../app/scripts/features/custom_command/templates/delete_command_modal.tpl.html',
		      controller: 'DeleteCommandModelController',
		      keyboard : false,
		      resolve : {
		      	command : function(){
		      		return command;
		      	}
		      }
		    });

		    modalInstance.result.then(function (command) {
		      DoAlert.success('删除指令成功');
		    }, function(data){
		      
		    });
		};
	}]);
	module.controller('CustomCommandDetailController', ['$scope', '$modal', 'DoAlert',function($scope, $modal, DoAlert){
		if(+$scope.command.status===1){
			$scope.enabled = true;
		}else{
			$scope.enabled = false;
		}
		$scope.$watch('enabled', function(state){
			if(state){
				$scope.command.setAttr('status', '1');
				$scope.command.save(function(){
					$scope.command.confirmEdit();
				}, function(){
					$scope.command.cancelEdit();
					$scope.enabled = false;
				});
				$scope.switchTooltip = '禁用';
			}else{
				$scope.command.setAttr('status', '0');
				$scope.command.save(function(){
					$scope.command.confirmEdit();
				}, function(){
					$scope.command.cancelEdit();
					$scope.enabled = true;
				});
				$scope.switchTooltip = '启用';
			}
		});
		$scope.editCommand = function(command){
			var modalInstance = $modal.open({
		      animation: true,
		      templateUrl: '../app/scripts/features/custom_command/templates/custom_command_modal.tpl.html',
		      controller: 'CustomCommandModalController',
		      keyboard : false,
		      resolve : {
		      	command : function(){
		      		return command;
		      	}
		      }
		    });

		    modalInstance.result.then(function (command) {
		      DoAlert.success('修改指令成功');
		      if(+command.status===0){
		      	$scope.enabled = false;
		      }else{
		      	$scope.enabled = true;
		      }
		    }, function(data){
		      
		    });
		};
	}]);
	module.controller('CustomCommandModalController', ['$scope', 'CustomCommandService', '$modalInstance', 'DoAlert', 'command',function($scope, ccs, $modalInstance, DoAlert, command){
		if(command){
			$scope.isEdit = true;
			$scope.command = command;
		}else{
			$scope.isEdit = false;
			$scope.command = ccs.newCommand();
		}
		$scope.response_tooltip = "{{name}}代表指令请求者名字,{{message}}代表指令请求者发送的额外信息";
		$scope.ok = function(){
			if($scope.isEdit){
				$scope.command.save(function(command){
					$modalInstance.close(command);
				}, function(data){
					DoAlert.error(data.message);
				});
			}else{
				ccs.addCommand($scope.command, function(command){
					$modalInstance.close(command);
				}, function(data){
					DoAlert.error(data.message);
				});
			}
		};
		$scope.cancel = function(){
			$modalInstance.dismiss();
		};
	}]);
	module.controller('DeleteCommandModelController', ['$scope','CustomCommandService', '$modalInstance', 'DoAlert', 'command', function($scope, ccs, $modalInstance, DoAlert, command){
		$scope.command = command;
		$scope.ok = function(){
			ccs.removeCommand(command, function(cmd){
				$modalInstance.close(cmd);
			}, function(data){
				DoAlert.error(data.message);
			});
		};
		$scope.cancel = function(){
			$modalInstance.dismiss();
		};
	}])
})();