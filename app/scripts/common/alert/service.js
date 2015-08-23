/**
 * @module common.alert.service
 */
(function(){
	'use strict';
	var module = angular.module('common.alert.service',['angular-toasty']);
	module.service('DoAlert', ['toasty', function(toasty){
		function success(msg){
			toasty.success({
			    msg: msg,
			    showClose: true,
			    clickToClose: true,
			    timeout: 2000,
			    sound: true,
			    html: false,
			    shake: false,
			    theme: "bootstrap"
			});
		}
		function error(msg){
			toasty.error({
			    msg: msg,
			    showClose: true,
			    clickToClose: true,
			    timeout: 2000,
			    sound: true,
			    html: false,
			    shake: true,
			    theme: "bootstrap"
			});
		}
		function info(msg){
			toasty.info({
			    msg: msg,
			    showClose: true,
			    clickToClose: true,
			    timeout: 2000,
			    sound: true,
			    html: false,
			    shake: true,
			    theme: "bootstrap"
			});
		}
		return {
			success : success,
			error : error,
			info : info,
		};
	}]);
})(); 