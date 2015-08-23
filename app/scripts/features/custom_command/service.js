/**
 * @module features.custom_command.service
 */
(function(){
	var module = angular.module('features.custom_command.service', []);
	module.service('CustomCommandService', ['DoModel', 'DoDanmu', '$rootScope','DoUser',function(model, DoDanmu, $rootScope, DoUser){
		var commands,
			registerMap = {};
		function getCommands(success, error){
			if(commands){
				success(commands);
			}else{
				model.CustomCommand.list(function(res){
					for(var i=0,len=res.length;i<len;i++){
						registerMap[res[i].name.slice(1)] = res[i];
					}
					commands = res;
					success(commands);
				}, error);
			}
		}
		function addCommand(command, success, error){
			command.save(function(cmd){
				commands.push(cmd);
				registerMap[cmd.name.slice(1)] = cmd;
				$rootScope.$broadcast('CommandsChange');
				success(cmd);
			}, error);
		}
		function removeCommand(command, success, error){
			command.delete(function(cmd){
				commands.remove(cmd, function(){
					registerMap[cmd.name.slice(1)] = null;
					$rootScope.$broadcast('CommandsChange');
					success(cmd);
				});
			}, error);
		}
		function newCommand(){
			return new model.CustomCommand({uid:$rootScope.user.id, status:'1', auth:'1'});
		}
		DoDanmu.Receiver.addListener(function(data){
			var match,
				reg =  /^\!([^\s]+)\s*(.*)$/,
				resp;
			if(data.type==='chatmessage'){
				match = reg.exec(data.content);
				if(match){
					if(registerMap[match[1]]){
						resp = registerMap[match[1]].process(data, match[2]);
						DoDanmu.Sender.send(resp);
					}
				}
			}
		});
		$rootScope.$on('UserLogout', function(){
			commands = null;
			registerMap = {};
		});
		return {
			getCommands : getCommands,
			addCommand : addCommand,
			removeCommand : removeCommand,
			newCommand : newCommand
		};
	}]);
})();