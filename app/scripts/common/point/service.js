/**
 * @module common.point.service
 */
(function(){
	var module = angular.module('common.point.service',[]);
	module.run(['DoPoint', 'SystemCommandService', 'DoPresent',function(DoPoint, scs, DoPresent){
		scs.register('!point', '查看用户当前积分', '1',function(data){
			var point = DoPoint.getUserPoint(data.uid);
			return '@'+data.name+':你的当前积分为'+point;
		});
		DoPresent.Receiver.addListener(function(data){
			DoPoint.increaseUserPoint(data.uid, data.quantity);
		});
	}]);
	module.service('DoPoint', ['DoRoom','DoPlatform',function(room, DoPlatform){
		var platform = DoPlatform.current();
		function getUserPoint(uid){
			var user;
			if(typeof uid === 'object'){
				user = uid;
			}else{
				user = room.getUser(uid);
			}
			return user.point;
		}
		function increaseUserPoint(uid, count){
			var user;
			if(typeof uid === 'object'){
				user = uid;
			}else{
				user = room.getUser(uid);
			}
			user.point = user.point + platform.pointConversion(count);
			return user;
		}
		return {
			getUserPoint : getUserPoint,
			increaseUserPoint : increaseUserPoint
		};
	}]);
})();