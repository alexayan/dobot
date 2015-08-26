/**
 * @module features.system_command.service
 */
(function(){
	var module = angular.module('features.system_command.service', []);
	module.run(['SystemCommandService', 'CustomCommandService',function(scs, ccs){
		scs.register('!list', '查看所有可用指令', '1',function(data){
			var map = ccs.getRegisterMap(),
				name, 
				res = '@'+data.name+':',
				i = 1;
			for(name in map){
				if(!ccs.canUseCommand(data.uid, map[name])){
					continue;
				}
				res += (''+i+'.'+name+'。');
				i++;
			}
			return res;
		});
		scs.register('!help', '查看指定指令描述', '1',function(data){
			var map = ccs.getRegisterMap(),
				res = '@'+data.name+':',
				cmd = map[data.message],
				desc;
			if(cmd){
				desc = cmd.description||'没有描述';
				return res + cmd.name + '('+desc+')。';
			}else{
				return res+'没有'+data.message+'指令';
			}
		});
	}]);
	module.service('SystemCommandService', ['CustomCommandService', function(ccs){
		var commands = [];
		function register(name, desc, status, process){
			var cmd = ccs.newCommand({name: name, auth:'1', status:status, description:desc});
			cmd.process = process;
			ccs.registerCommand(cmd);
			commands.push(cmd);
		}

		return {
			register : register,
			getSystemCommands : function(){
				return commands;
			}
		};
	}]);
})();