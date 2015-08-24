/**
 * @module features.system_command.service
 */
(function(){
	var module = angular.module('features.system_command.service', []);
	module.service('SystemCommandService', ['CustomCommandService', function(ccs){
		var commands = [];
		function register(name, desc, process){
			var cmd = ccs.newCommand({name: name, auth:'1', status:'1', description:desc});
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