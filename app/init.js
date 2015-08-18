/**
 *	angular应用初始化
 */

(function(window, angular){
	var appRootElement = document.getElementById('dobot');
	angular.module('dobot',[
		'do.sidebar',
		'common.tools',
		'common.model',
		'common.dialog',
		'common.config',
		'common.translate',
		'templates-main'
	]).config(['$httpProvider', function($httpProvider){
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		var param = function(obj) {
    		var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
		    for(name in obj) {
		      value = obj[name];
		        
		      if(value instanceof Array) {
		        for(i=0; i<value.length; ++i) {
		          subValue = value[i];
		          fullSubName = name + '[' + i + ']';
		          innerObj = {};
		          innerObj[fullSubName] = subValue;
		          query += param(innerObj) + '&';
		        }
		      }
		      else if(value instanceof Object) {
		        for(subName in value) {
		          subValue = value[subName];
		          fullSubName = name + '[' + subName + ']';
		          innerObj = {};
		          innerObj[fullSubName] = subValue;
		          query += param(innerObj) + '&';
		        }
		      }
		      else if(value !== undefined && value !== null)
		        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
		    }
		      
		    return query.length ? query.substr(0, query.length - 1) : query;
		};
		$httpProvider.defaults.transformRequest = [function(data) {
			return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
		}];
	}]).run(['$rootScope', 'DoModel',function($rootScope, model){
		window.model = model;
		$rootScope.user = true;
		$rootScope.app = {isLoading:false, curView: 'dashboard'};
	}]);
	angular.bootstrap(appRootElement, ['dobot']);
})(window, angular);