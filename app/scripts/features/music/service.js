/**
 * @module features.system_command.service
 */
(function(){
	var module = angular.module('features.music.service', []);
	module.run(['DoMusicService', 'SystemCommandService','DoAlert','angularPlayer','DoRoom','DoDanmu','$rootScope',function(dms, scs, DoAlert,angularPlayer,DoRoom,DoDanmu,$rootScope){
		scs.register('!music', '弹幕点歌需要消耗point,可以通过!point查询point。point由赠送礼物获得', '1',function(data){
			if(!/^\s*$/.test(data.message)){
				var roomuser = DoRoom.getUser(data.uid);
				var point = roomuser.point;
				var cost = dms.getMusicCost();
				if(point>=cost){
					dms.search(data.message, function(musics){
						if(musics.length>0){
							musics[0].fetchDetail(function(music){
								if(music.urlFetched){
									var res = '@'+data.name+':成功点歌'+music.name+'。';
									var playList = angularPlayer.getPlaylist();
									var currentKey = angularPlayer.isInArray(playList, music.id);
									if(playList.length !== 0 && currentKey){
										DoDanmu.Sender.send('@'+data.name+':歌曲已经在播放列表中');
										return;
									}
									if(playList.length>0){
										res += ('将在'+playList.length+'首歌后播放。');
									}else{
										res += ('即将播放。');
									}
									music.assign = data.name;
									angularPlayer.addTrack(music);
									console.log(music);
									if(!angularPlayer.isPlayingStatus()){
										angularPlayer.playTrack(music.id);
									}
									roomuser.point = roomuser.point-cost;
									DoDanmu.Sender.send(res);
								}
							},function(data){
								console.log(data);
							});
						}else{
							DoDanmu.Sender.send('@'+data.name+':歌曲不存在');
						}
					},function(data){
						console.error(data);
					});
				}else{
					DoDanmu.Sender.send('@'+data.name+':point不足，无法点歌，请赠送鱼丸获得point');
				}
			}else{
				DoDanmu.Sender.send('@'+data.name+':请输入歌曲名');
			}
			return null;
		});
		scs.register('!bgm', '查询当前背景音乐', '1', function(data){
			var music = angularPlayer.currentTrackData();
			if(music){
				return '@'+data.name+':当前正在播放 '+music.name+'。';
			}
		});
		$rootScope.$on('music:done', function(event, music){
			var playList = angularPlayer.getPlaylist();
			var currentKey = angularPlayer.isInArray(playList, music.id);
			angularPlayer.removeSong(music.id, currentKey);
		})
	}]);
	module.service('DoMusicService', ['CustomCommandService', 'DoModel', '$http', 'API_HOST',function(ccs, model, $http, API_HOST){
		var MUSIC_COST = 0;
		var NeteaseMusic = model.create_model('NeteaseMusic', {
			search : function(q, success, error){
				$http.get(API_HOST+'/music/search', {params:{s:q}}).success(function(data){
					if(data.code === 200){
						var res = new model.ModelArray(); 
						if(data.result.songCount!==0){
							for(var i=0,len=data.result.songs.length;i<len;i++){
								res.push(new NeteaseMusic(data.result.songs[i]));
							}
						}
						if(success){
							success(res);
						}
					}else{
						if(error){
							error(data);
						}
					}
				}).error(function(data){
					if(error){
						error(data);
					}
				});
			}
		}, {
			init : function(data){
				this.urlFetched = false;
			},
			fetchDetail : function(success,error){
				var that = this;
				if(this.id){
					$http.get(API_HOST+'/music/detail', {params:{id:this.id}}).success(function(data){
						if(data&&data[0]){
							that.url = data[0].mp3Url;
							that.detail = data[0];
							that.urlFetched = true;
							success(that);
						}else{
							error(that);
						}
					}).error(function(data){
						if(error){
							error(that);
						}
					});
				}else{
					error('网络错误');
				}
			}
		}, {
			id : [],
			title : [],
			url : [],
			artist : []
		}, null);

		function search(query, success, error){
			NeteaseMusic.search(query, success, error);
		}
		function getMusicCost(){
			return MUSIC_COST;
		}
		function setMusicCost(cost){
			if(typeof cost === 'number'){
				if(cost >= 0){
					MUSIC_COST = cost;
				}
			}
		}
		return {
			search : search,
			getMusicCost : getMusicCost,
			setMusicCost : setMusicCost
		};
	}]);
})();