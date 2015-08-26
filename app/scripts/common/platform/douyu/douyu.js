/**
 * @module common.platform.douyu
 * 斗鱼tv配置
 */
(function(){
	var module = angular.module('common.platform.douyu',['common.platform']);
	module.run(['DoPlatform', '$window', 'DoTools', '$document',function(platform, $window, DoTools, $document){
		var prevMessage = '';
		//注册斗鱼配置
		platform.register('www.douyutv.com', {
			domain : 'www.douyutv.com',
			name : 'douyu',
			danmuListener : {
				scope : $window,
				name : 'returnmsg'
			},
			presentListener : {
				scope : $window.gift_obj,
				name : 'retutn_gift'
			},
			pointConversion : function(count){
				return +count/100;
			},
			presentDecode : function(gift){
				var data = $window.Sttdecode(gift);
				var user = $window.Sttdecode(DoTools.findObjectInArray(data, {name:'sui'})[0].value);
				var uid = DoTools.findObjectInArray(user, {name:'id'})[0].value;
				var name = DoTools.findObjectInArray(user, {name:'nick'})[0].value;
				var quantity = DoTools.findObjectInArray(data, {name:'ms'})[0].value;
				return {
					uid : uid,
					name : name,
					quantity : quantity,
					date : new Date()
				};
			},
			sendDanmu : function(message){
				if(message===prevMessage){
					message = message + '~';
				}
				$window.thisMovie( "WebRoom" ).js_sendmsg($window.Sttencode([{name:'content', value: message},{
               		name: "scope",
                	value:  0
            	},
            	{
                	name: "col",
               		value: 0
            	},{
        			name: "sender",
        			value: platform.current().user().uid
    			}]));
    			prevMessage = message;
			},
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
					content : content,
					date : new Date()
				};
			},
			user : function(){
				if($SYS.uid && $SYS.uid){
					return {
						uid : $SYS.uid,
						name : $SYS.name
					};
				}else{
					return null;
				}
			},
			room : function(){
				if($ROOM){
					return {
						rid : $ROOM.room_id,
						oid : $ROOM.owner_uid,
						name : $ROOM.room_name
					};
				}else{
					return null;
				}
			}
		});
	}]);
})();