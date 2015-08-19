(function(){
	var module = angular.module('common.tools',[]);
	module.service('DoTools', ['$rootScope',function($rootScope){
		/**
		 * 函数注入
		 * @param  {Object}   scope 目标函数所在作用域
		 * @param  {String}   name  目标函数名字
		 * @param  {Function} func  待注入函数
		 * @return {undefined} 
		 */
		function inject(target, func){
			var scope, name;
			if(typeof target !== 'function'){
				scope = target.scope;
				name = target.name;
				if(!scope || !scope[name]){
					return;
				}
				target = scope[name];
				scope[name] = function(){
					func.apply(null, arguments);
					return target.apply(null, arguments);
				};
			}else{
				return function(){
					func.apply(null, arguments);
					return target.apply(null, arguments);
				};
			}
		}
		/**
		 * 在对象数组中查找特定对象
		 * @param  {Array}  array     目标数组
		 * @param  {Object} condition 查找条件
		 * @return {Array}            匹配的对象数组
		 */
		function findObjectInArray(array, condition){
			var i,len,prop,obj,match,res=[];
			for(i=0,len=array.length; i<len; i++){
				obj = array[i];
				match = true;
				for(prop in condition){
					if(obj[prop] !== condition[prop]){
						match = false;
						break;
					}
				}
				if(match){
					res.push(obj);
				}
			}
			return res;
		}

		return {
			inject : inject,
			findObjectInArray : findObjectInArray
		};
	}]);
})();