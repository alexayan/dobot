(function(root){
	'use strict';
	var processors = {};
	var models = {};
	function register_processor(name, func){
		processors[name] = func;
	}
	register_processor('$require', function(data){
		if(data === undefined || data === null || data === ''){
			return false;
		}else{
			return true;
		}
	});

	register_processor('$in', function(data, arr){
		var tag = false;
		for(var i=0,len=arr.length; i<len; i++){
			var k = arr[i];
			if(k == data){
				tag = true; 
			}
		}
		return tag;
	});

	register_processor('$range', function(data, arr){
		var min = parseInt(arr[0]);
		var max = arr[1];
		if(!max){
			max = Number.MAX_VALUE;
		}else{
			max = parseInt(max); 
		}
		data = parseInt(data);
		if(data>=min && data<=max){
			return true;
		}else{
			return false;
		}
	});

	register_processor('$int', function(data){
		data = parseInt(data);
		if(isNaN(data)){
			return false;
		}else{
			return true;
		}
	});

	register_processor('$string', function(data){
		return ''+data;
	}); 
	register_processor('$email', function(data){
		return /^.+@.+$/.test(data);
	});
	register_processor('$mobile', function(data){
		return /^\d{11}$/.test(data);
	});
	function merge(t, s, types){
		for(var prop in s){
			if(s.hasOwnProperty(prop)){
				if(types && types.indexOf(prop)!==-1){
					t[prop] = (function(p){
						var f1 = t[p];
						var f2 = s[p];
						return function(){
							if(f1.apply(this,arguments)===false){
								return;
							}
							f2.apply(this,arguments);
						};
					})(prop);
				}else{
					t[prop] = s[prop];
				}
			}
		}
		return t;
	}
	function is_array(obj){
		return Object.prototype.toString.call(obj) === '[object Array]';
	}
	function filter(arr, obj){
		if(!arr){
			return [];
		}
		var res = [];
		for(var i=0,len=arr.length; i<len; i++){
			for(var prop in obj){
				if(arr[i][prop] == obj[prop]){
					res.push(arr[i]);
				}
			}
		}
		if(res.length==1){
			return res[0];
		}
		return res;
	}
	var _tag = true;
	var module = angular.module('common.model',[]);
	module.service('DoModel', ['$rootScope', 'DoTools', '$http', 'API_HOST', '$interpolate', function($rootScope, tools, $http, API_HOST, $interpolate){
		function create_model(classname, classmethods, instancemethods, meta, inherit, func){
			var Hehe = function(props){
				if(typeof inherit == 'function'){
					inherit.apply(this,props);
				}
				this.meta = meta;
				this._temp = props || {};
				this._dirty = [];
				this.__class = classname;
				for(var prop in props){
					if(props.hasOwnProperty(prop)){
						this[prop] = props[prop];
					}
				}
				if(func){
					func.call(this, props);
				}
				if(typeof this.init === 'function'){
					this.init(props);
				}
				this.verify();
			};
			Hehe.__classname = classname;
			if(!inherit || (!inherit.meta && !inherit._temp)){
				inherit = function(){};
				inherit.prototype.setAttr = function(name, value){
					var that = this;
					function _set(name, value){
						if(that.meta[name] === undefined){
							that[name] = value;
							return;
						}
						var old = that._temp[name];
						if(value !== old){
							if(that._dirty.indexOf(name) === -1){
								that._dirty.push(name);
							}
						}else{
							if(that._dirty.indexOf(name) !== -1){
								that._dirty.splice(that._dirty.indexOf(name));
							}
						}
						that[name] = value;
					}
					if(typeof name === 'string'){
						_set(name, value);
					}else{
						for(var prop in name){
							if(name.hasOwnProperty(prop)){
								_set(prop, name[prop]);
							}
						}
					}
				};
				//!todo: http请求的数据验证
				inherit.prototype.verify = function(){
					for(var prop in this.meta){
						var tasks = this.meta[prop];
						for(var i=0,len=tasks.length; i<len; i++){
							var task = tasks[i];
							var data = this[prop];
							var arr = task.split(':');
							var val;
							var key = arr.shift();
							var process = processors[key];
							if(!(val=process.call(this,data, arr))){
								//ApDialog.verify_error_dialog(prop, key, arr);
								console.log('prop "'+prop+'" in processor "'+key+'" error');
								return false;
								// throw new Error('prop "'+prop+'" in processor "'+key+'" error');
							}
							if(val !== true){
								this[prop] = val;
							}
						}
					}
					return true;
				};
				inherit.prototype.cancelEdit = function () {
		          for (var prop in this._temp) {
		            if (this._temp.hasOwnProperty(prop)) {
		              this[prop] = this._temp[prop];
		            }
		          }
		        };
		        inherit.prototype.confirmEdit = function () {
		          for (var prop in this.meta) {
		            if (this.meta.hasOwnProperty(prop)) {
		              this._temp[prop] = this[prop];
		            }
		          }
		        };
				inherit.prototype.toJSON = function(meta){
					var res = {},
						prop;
					if(meta){
						for(prop in this.meta){
							res[prop] = this[prop];
						}
						return res;
					}
					for(prop in this){
						if(this.hasOwnProperty(prop)){
							if(isModelArray(this[prop]) || isModel(this[prop])){
								res[prop] = this[prop].toJSON();
							}else{
								res[prop] = this[prop];
							}
						}
					}
					return res;
				};
				inherit.prototype.check_dirty = function(){
					for(var prop in this.meta){
						if(prop === 'id'){
							continue;
						}
						if(this.meta.hasOwnProperty(prop)){
							var old = this._temp[prop];
							var n = this[prop];
							if(n !== old){
								if(this._dirty.indexOf(prop) === -1){
									this._dirty.push(prop);
								}
							}else{
								if(this._dirty.indexOf(prop) !== -1){
									this._dirty.splice(this._dirty.indexOf(prop),1);
								}
							}
						}
					}
				};
				inherit.prototype.get_dirty = function(){
					var data={}, i, len;
					for(i=0,len=this._dirty.length; i<len; i++){
						data[this._dirty[i]] = this[this._dirty[i]];
					}
					return data;
				};
				inherit.prototype.save = function(){
					if(!this.verify()){
						return false;
					}
					this.check_dirty();
				};
				inherit.prototype.has_dirty = function(deep){
					this.check_dirty();
					if(deep){
						for(var prop in this){
							if(this.hasOwnProperty(prop)){
								var v = this[prop];
								if(isModel(v) || isModelArray(v)){
									if(v.has_dirty(deep)){
										return true;
									}
								}
							}
						}
						return false;
					}else{
						return this._dirty.length > 0;
					}
				};
				inherit.prototype.is_instanceof = function(cls){
					if(cls.__classname){
						if(this.__class === cls.__classname){
							return true;
						}else{
							return false;
						}
					}
					return this instanceof cls;
				};
			}
			Hehe.prototype = merge(merge({},inherit.prototype), instancemethods, ['save']);
			for(var prop in classmethods){
				if(classmethods.hasOwnProperty(prop)){
					Hehe[prop] = classmethods[prop];
				}
			}
			models[classname] = Hehe;
			return Hehe;
		}
		function ModelArray(){
			Array.apply(this, arguments);
		}
		ModelArray.prototype = [];
		ModelArray.prototype.toJSON = function(){
			var res = [];
		 	for(var i=0,len=this.length; i<len; i++){
		 		res.push(this[i].toJSON());
			}
		 	return res;
		};
		ModelArray.prototype.remove = function(item, success){
			this.splice(this.indexOf(item), 1);
			if(success){
				success();
			}
		};
		ModelArray.prototype.find_one = function(opt){
			for(var i=0,len=this.length; i<len; i++){
				var tag = true;
				for(var prop in opt){
					if(opt.hasOwnProperty(prop)){
						if(this[i][prop] !== opt[prop]){
							tag = false;
							break;
						}
					}
				}
				if(tag){
					return this[i];
				}
			}
		};
		ModelArray.prototype.has_dirty = function(deep){
			var tag = false;
			for(var i=0,len=this.length; i<len; i++){
				if(this[i].has_dirty(deep)){
					tag = true;
					break;
				}
			}
			return tag;
		};
		ModelArray.prototype.find = function(obj){
			return filter(this, obj);
		};
		ModelArray.prototype.each = function(func){
			if(typeof this.every === 'function'){
				this.every(func);
			}else{
				for(var i=0,len=this.length; i<len; i++){
					if(func(this[i], i, this) === false){
						break;
					}
				}
			}
		};
		ModelArray.prototype.map = function(func){
			if([].map){
				return [].map.call(this, func);
			}else{
				var res = [];
				this.each(function(){
					res.push(func.apply(null, arguments));
				});
				return res;
			}
		};
		ModelArray.prototype.concat = function(arr){
			for(var i=0, len=arr.length; i<len; i++){
				this.push(arr[i]);
			}
		};
		function isArray(obj){
			if(!obj){
				return false;
			}
			if(obj.length !== undefined && obj.sort && obj.push){
				return true;
			}else{
				return false;
			}
		}
		function isModel(obj){
			if(!obj){
				return false;
			}
			if(obj !== null && typeof obj=== 'object' && obj.__class){
				return true;
			}else{
				return false;
			}
		}
		function isModelArray(obj){
			if(!obj){
				return false;
			}
			if(obj instanceof ModelArray && obj.has_dirty){
				return true;
			}else{
				return false;
			}
		}
		function serialize(obj){
			return JSON.stringify(obj);
		}
		function deserialize(str){
			function process(obj){
				var res;
				if(isArray(obj)){
					res = new ModelArray();
					for(var i=0,len=obj.length; i<len; i++){
						res.push(process(obj[i]));
					}
				}else if(isModel(obj)){
					var _obj = {};
					for(var prop in obj){
						if(obj.hasOwnProperty(prop)){
							if(isModel(obj[prop]) || isArray(obj[prop])){
								_obj[prop] = process(obj[prop]);
							}else{
								_obj[prop] = obj[prop];
							}
						}
					}
					res = new models[obj.__class](_obj);
				}else{
					res = obj;
				}
				return res;
			}
			var obj = JSON.parse(str);
			return process(obj);
		}
		function error_wraper(success, error, args){
			return function(){
				success.call(null, args);
				if(error){
					error();
				}
			};
		}
		function network_error_processor(error){
			error && error({type:'error', message: '网络错误'});
		}
		function set_temp_if_save_success(model){
			for(var prop in model.meta){
				if(model.meta.hasOwnProperty(prop)){
					model._temp[prop] = model[prop];
				}
			}
		}

	// UserApi
		var User = create_model('User',{
			login : function(data, success, error){
				$http.post(API_HOST+'/login', data).success(function(data){
					if(data.status === 'success'){
						success && success(new User(data.result));
					}else if(data.status === 'error'){
						error && error(data);
					}
				}).error(function(data){
					network_error_processor(error);
				});
			},
			register : function(data, success, error){
				$http.post(API_HOST+'/register', data).success(function(data){
					if(data.status === 'success'){
						success && success(new User(data.result));
					}else if(data.status === 'error'){
						error && error(data);
					}
				}).error(function(data){
					network_error_processor(error);
				});
			},
			current : function(success, error){
				$http.get(API_HOST+'/currentuser').success(function(data){
					if(data.status === 'success'){
						success && success(new User(data.result));
					}else if(data.status === 'error'){
						error && error(data);
					}
				}).error(function(data){
					network_error_processor(error);
				});
			}
		},{
			logout : function(success, error){
				var that = this;
				$http.get(API_HOST+'/logout').success(function(data){
					if(data.status === 'success'){
						success && success(that);
					}else if(data.status === 'error'){
						error && error(data);
					}
				}).error(function(data){
					network_error_processor(error);
				});
			},
			update : function(success, error){
				
			},
			init : function(prop){
				
			},
			find_one : function(opt){
			},
		},{
			id : [],
			name : [],
			email : [],
		},null);

		var CustomCommand = create_model('CustomCommand', {
			list : function(success, error){
				$http.get(API_HOST+'/customcommand').success(function(data){
					if(data.status === 'success'){
						var res = new ModelArray();
						for(var i=0,len=data.result.length;i<len;i++){
							res.push(new CustomCommand(data.result[i]));
						}
						success && success(res);
					}else if(data.status === 'error'){
						error && error(data);
					}
				}).error(function(data){
					network_error_processor(error);
				});
			},
			create : function(data, success, error){
				$http.post(API_HOST+'/customcommand', data).success(function(data){
					if(data.status === 'success'){
						success && success(new CustomCommand(data.result));
					}else if(data.status === 'error'){
						error && error(data);
					}
				}).error(function(data){
					network_error_processor(error);
				});
			}
		}, {
			changeStatus : function(status){
				this.setAttr('status', status);
			},
			save : function(success, error){
				var data,
					that = this;
				if(this.id){
					if(this._dirty.length === 0){
						success(this);
						return;
					}
					data = this.get_dirty();
					$http.put(API_HOST+'/customcommand/'+this.id, data).success(function(data){
						if(data.status === 'success'){
							set_temp_if_save_success(that);
							success && success(that);
						}else if(data.status === 'error'){
							error && error(data);
						}
					}).error(function(data){
						network_error_processor(error);
					});
				}else{
					data = this.toJSON(true);
					$http.post(API_HOST+'/customcommand', data).success(function(data){
						if(data.status === 'success'){
							set_temp_if_save_success(that);
							that.id = data.result.id;
							success && success(that);
						}else if(data.status === 'error'){
							error && error(data);
						}
					}).error(function(data){
						network_error_processor(error);
					});
				}
			},
			delete : function(success, error){
				var that = this;
				$http.delete(API_HOST+'/customcommand/'+this.id).success(function(data){
					if(data.status === 'success'){
						success && success(that);
					}else if(data.status === 'error'){
						error && error(data);
					}
				}).error(function(data){
					network_error_processor(error);
				});
			},
			process : function(ctx){
				if(''+this.status === '1'){
					return $interpolate(this.response)(ctx);
				}
			}
		}, {
			id : [],
			name : [],
			response : [],
			auth : ['$string'],
			status : ['$string'],
			description : [],
			uid : []
		}, null);

		return {
			ModelArray : ModelArray,
			User : User,
			CustomCommand : CustomCommand,
			serialize : serialize,
			deserialize : deserialize,
		};
	}]);
})(this);