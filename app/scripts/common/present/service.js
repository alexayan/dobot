/**
 * @module common.present.service
 */
(function(){
	var module = angular.module('common.present.service',[]);
	module.service('DoPresent', ['DoTools','$rootScope','DoPlatform','$interval',function(DoTools, $rootScope, DoPlatform, $interval){
		var platform = DoPlatform.current();
		var Receiver = (function(){
			var datas = [],
				tasks = [],
				i = null,
				interval = 1000,
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
				data = platform.presentDecode(data);
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
			DoTools.inject(platform.presentListener, injector); 
			return {
				addListener : addListener,
				setInterval : setInterval,
				changeOptimizationMode : changeOptimizationMode
			};
		})();


		return {
			Receiver : Receiver
		};
	}]);
})();