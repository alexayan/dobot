/**
 * @module common.room.service
 */
(function(){
	var module = angular.module('common.room.service',[]);
	module.service('DoRoom', ['DoModel',function(model){
		var userList = [];
		var RoomUser = model.create_model('RoomUser',{},{
			init : function(prop){
				if(prop.point===undefined){
					this.point = 0;
				}
			}
		},{
			point:[]
		},null);
		function getUserList(){
			return userList;
		}
		function getUser(uid){
			var user = userList[+uid];
			if(!user){
				user = userList[uid] = new RoomUser({uid:uid});
			}
			return user;
		}
		function addUser(user){
			if(!userList[user.uid]){
				user = userList[user.uid] = new RoomUser(user);
			}else{
				user =  userList[user.uid];
			}
			return user;
		}
		window.getUserList = getUserList;
		return {
			getUserList : getUserList,
			getUser : getUser,
			addUser : addUser
		};
	}]);
})();