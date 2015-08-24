/**
 * @module features.system_command
 */
(function(){
	var module = angular.module('features.system_command', ['features.system_command.controller','features.system_command.service']);
	module.run(['SystemCommandService', 'CustomCommandService',function(scs, ccs){
		scs.register('!list', '查看所有可用指令', function(data){
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
		scs.register('!help', '查看指定指令描述', function(data){
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
		})
	}]);
})();