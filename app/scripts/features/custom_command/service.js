/**
 * @module features.custom_command.service
 */
(function(){
	var module = angular.module('features.custom_command.service', []);
	module.service('CustomCommandService', ['DoModel', 'DoDanmu', '$rootScope','DoUser','DoPlatform',function(model, DoDanmu, $rootScope, DoUser, platform){
		var commands,
			registerMap = {};
		function getCommands(success, error){
			if(commands){
				success(commands);
			}else{
				model.CustomCommand.list(function(res){
					for(var i=0,len=res.length;i<len;i++){
						registerMap[res[i].name] = res[i];
					}
					commands = res;
					success(commands);
				}, error);
			}
		}
		function addCommand(command, success, error){
			command.save(function(cmd){
				commands.push(cmd);
				registerMap[cmd.name] = cmd;
				$rootScope.$broadcast('CommandsChange');
				success(cmd);
			}, error);
		}
		function removeCommand(command, success, error){
			command.delete(function(cmd){
				commands.remove(cmd, function(){
					registerMap[cmd.name] = null;
					$rootScope.$broadcast('CommandsChange');
					success(cmd);
				});
			}, error);
		}
		function newCommand(opt){
			if(opt){
				return new model.CustomCommand(opt);
			}else{
				return new model.CustomCommand({uid:$rootScope.user.id, status:'1', auth:'1', description:''});
			}
		}
		function registerCommand(cmd){
			registerMap[cmd.name] = cmd;
		}
		function getRegisterMap(){
			return registerMap;
		}
		function canUseCommand(uid, cmd){
			var room = platform.current().room();
			if(+cmd.auth  !== 1){
				if(+uid !== +room.oid){
					return false;
				}
			}
			return true;
		}
		DoDanmu.Receiver.addListener(function(data){
			var match,
				reg =  /^(\![^\s]+)\s*(.*)$/,
				resp,
				cmd,
				user = platform.current().user(),
				room = platform.current().room();
			if(data.type==='chatmessage'){
				match = reg.exec(data.content);
				if(!room || !user || !match){
					return;
				}
				cmd = registerMap[match[1]];
				if(!cmd){
					return;
				}
				if(+cmd.status === 0){
					return;
				}
				if(!canUseCommand(data.uid, cmd)){
					return;
				}
				data.message = match[2];
				data.cmd = match[1];
				resp = cmd.process(data);
				if(resp){
					DoDanmu.Sender.send(resp);
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
			newCommand : newCommand,
			registerCommand : registerCommand,
			getRegisterMap : getRegisterMap,
			canUseCommand : canUseCommand
		};
	}]);
})();