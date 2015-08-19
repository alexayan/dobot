/**
 * @module common.platform.douyu
 * 斗鱼tv配置
 */
(function(){
	var module = angular.module('common.platform.douyu',['common.platform']);
	module.run(['DoPlatform', '$window', 'DoTools', function(platform, $window, DoTools){
		//注册斗鱼配置
		platform.register('www.douyutv.com', {
			domain : 'www.douyutv.com',
			name : 'douyu',
			danmuListener : {
				scope : $window,
				name : 'returnmsg'
			},
			giftListener : {
				scope : $window,
				name : 'retutn_gift'
			},
			sendDanmu : $window.sendmsg,
			damnuDecode : function(danmu){
				var data = $window.Sttdecode(danmu);
				var name = DoTools.findObjectInArray(data, {name:'sender_nickname'})[0].value;
				var type = DoTools.findObjectInArray(data, {name:'type'})[0].value;
				var uid = DoTools.findObjectInArray(data, {name:'sender'})[0].value;
				var content = DoTools.findObjectInArray(data, {name:'content'})[0].value;
				return {
					name : name,
					type : type,
					uid : uid,
					content : content
				};
			}
		});
	}]);
})();