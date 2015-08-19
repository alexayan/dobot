/**
 * common.platform模块服务
 */
(function(){
	var module = angular.module('common.platform');
	module.service('DoPlatform', ['$location',function($location){
		var domain = $location.host(),
			platforms = {};
		/**
		 * 注册插件品台
		 * @param  {String} domain       所属域名。如: 'douyutv.com'
		 * @param  {Object} cfg 		 平台配置
		 * @return {undefined}           
		 */
		function register(domain, cfg){
			platforms[domain] = cfg;
		}

		/**
		 * 获得当前平台配置
		 * @return {[type]} [description]
		 */
		function current(){
			return platforms[domain];
		}

		return {
			register : register,
			current : current
		};
	}]);
})();