/**
 * @module common.danmu
 * 弹幕模块，封装不同平台的弹幕功能，提供统一的接口
 */
(function(){
	var module = angular.module('common.danmu',[]);
	module.service('DoDanmu', ['DoPlatform', 'DoTools', '$timeout', '$interval', '$rootScope',function(DoPlatform, DoTools, $timeout, $interval, $rootScope){
		var platform = DoPlatform.current();
		/**
		 * 消息发送管理
		 */
		var Sender = (function(){
			var arr = [];
			var status = false;
			var i = null;
			var interval = 1000;
			function send(message){
				if(!status){
					start();
				}
				arr.push(message);
			}
			function start(){
				function send(){
					var msg = arr.shift();
					if(msg){
						platform.sendDanmu(msg);
						i = $timeout(send, interval);
					}else{
						$timeout.cancel(i);
						status = false;
					}
				}
				i = $timeout(send, interval);
				status = true;
			}
			function stop(){
				$timeout.cancel(i);
			}
			function setInterval(i){
				interval = i;
			}
			$rootScope.$on('UserLogout', function(){
				arr = [];
			});
			return {
				'send' : send,
				'start' : start,
				'stop' : stop,
				'setInterval' : setInterval
			};
		})();

		var Receiver = (function(){
			var datas = [],
				tasks = [],
				i = null,
				interval = 600, //过小会引起阻塞，应该随着当前弹幕增加速率变化。当弹幕变多时，应该增加。
				optimizationMode = 'manual';
			$rootScope.$on('UserLogout', function(){
				tasks = [];
			});
			function addListener(func){
				tasks.push(func);
				if(!i){
					i = $interval(processor, interval);
				}
			}
			function processor(){
				var i,len,
					data = datas.shift();
				if(data){
					for(i=0,len=tasks.length; i<len; i++){
						tasks[i](data);
					}
					if(optimizationMode==='auto'){
						optimization(); 
					}
				}
			}
			function injector(data){
				if(tasks.length === 0){
					return;
				}
				data = platform.damnuDecode(data);
				datas.push(data);
			}
			function setInterval(time){
				if(optimizationMode!=='auto'){
					interval = time;
					$interval.cancel(i);
					i = $interval(processor, interval);
				}
			}
			function changeOptimizationMode(mode){
				optimizationMode = mode;
				if(mode!=='auto'){
					$interval.cancel(i);
					i = $interval(processor, interval);
				}else{
					optimization();
				}
			}
			function optimization(){
				return;
			}
			DoTools.inject(platform.danmuListener, injector);
			return {
				addListener : addListener,
				setInterval : setInterval,
				changeOptimizationMode : changeOptimizationMode
			};
		})();

		return {
			Sender : Sender,
			Receiver : Receiver
		};
	}]);
})();