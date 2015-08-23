/**
 * @module features.custom_command.filter
 */
(function(){
	var module = angular.module('features.custom_command.filter', []);
	module.filter('CommandAuthBeauty', function(){
		return function(data){
			data = +data;
			if(data === 1){
				return '所有人';
			}else{
				return '主播';
			}
		};
	});
})();