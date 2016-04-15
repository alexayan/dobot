#encoding=utf-8
from flask import Flask, g, request, render_template, json, url_for, redirect, session,jsonify, g, make_response, Response, abort, redirect,send_from_directory
from flask_restful import Resource, Api
import datetime,httplib, time, urllib2,urllib
import os, random, math, itertools, re
from sae.storage import Bucket, Connection
from db import *
from passlib.hash import md5_crypt
from flask_cors import CORS
from music import *


app = Flask(__name__)
app.debug = True
app.secret_key = '12345678'
cors = CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
api = Api(app)
SYSTEM_COMMAND_LIST = ['!list', '!help']
r_command = re.compile(r'^![^\s]+$')
music_api = NetEase()


def parse_form(f, *keys):
	#key1:value,key2:value;key1:value,key2:value
	def _parser1(s):
		items = []
		for item in s.split(";"):
			obj = {}
			for i in item.split(","):
				j = i.split(":")
				obj[j[0]] = j[1]
			items.append(obj)
		return items
	res = {}
	parsers = {"info":_parser1, "tag":_parser1}
	for key in keys:
		if not key in f:
			continue
		if key in parsers:
			if not f.get(key,None):
				continue
			res[key] = parsers[key](f[key])
		else:
			if not f.get(key,None):
				continue            
			res[key] = f[key]
	return res

@app.before_request
def before_request():
    g.db = database
    g.db.connect()
    g.user = session.get('user', None)

@app.after_request
def after_request(response):
    g.db.close()
    return response


class Login(Resource):
    def post(self):
        name = request.form.get('name', None)
        password = request.form.get('password', None)
        if not name or not password:
            return {'status': 'error', 'message': '用户名和密码不能为空'}
        user = User.getOne(User.name == name)
        if not user:
            return {'status': 'error', 'message': '用户不存在'}
        if not md5_crypt.verify(password, user.password):
            return {'status': 'error', 'message': '密码错误'}
        session['user'] = user
        data = user.toJson()
        data.pop('password')
        return {'status': 'success', 'result': data}

class Register(Resource):
    def post(self):
        name = request.form.get('name', None)
        password = request.form.get('password', None)
        if not name or not password:
            return {'status': 'error', 'message': '用户名和密码不能为空'}
        user = User.getOne(User.name == name)
        if user:
            return {'status': 'error', 'message': '用户已经存在'}
        user = User.create(name=name, password=md5_crypt.encrypt(password))
        user.save()
        session['user'] = user
        data = user.toJson()
        data.pop('password')
        return {'status': 'success', 'result': data}
    
class Logout(Resource):
    def get(self):
        user = session['user']
        if not user:
            return {'status':'error', 'message': '用户未登录'}
        data = user.toJson()
        data.pop('password')
        session['user'] = None
        return {'status': 'success', 'result': data}
    
class CurrentUser(Resource):
    def get(self):
        user = session.get('user', None)
        if not user:
            return {}
        data = user.toJson()
        data.pop('password')
        return {'status': 'success', 'result': data}

class RCustomCommand(Resource):
    def get(self):
        user = session.get('user', None)
        if not user:
            return {'status':'error', 'message':'请登录'}
        commands = CustomCommand.select().where(CustomCommand.uid == int(user.id))
        res = []
        for command in commands:
            res.append(command.toJson())
        return {'status':'success', 'result': res}
    def post(self):
        name = request.form.get('name', None)
        response = request.form.get('response', None)
        auth = request.form.get('auth', None)
        status = request.form.get('status', None)
        uid = request.form.get('uid', None)
        user = session.get('user', None)
        if not name or not response or not auth or not status:
            return {'status':'error', 'message':'缺少参数'}
        if name in SYSTEM_COMMAND_LIST:
            return {'status':'error', 'message':'不能定义系统指令'}
        if not r_command.match(name):
            return {'status':'error', 'message':'指令格式错误'}
        if not user:
            return {'status':'error', 'message':'请登录'}
        if int(user.id) != int(uid):
            return {'status':'error', 'message':'无权限'}
        command = CustomCommand.getOne(CustomCommand.name==name)
        if command:
            return {'status':'error', 'message':'不能创建相同指令'}
        command = CustomCommand.create(name=name,response=response,auth=auth,status=status,uid=uid)
        command.save()
        return {'status':'success', 'result':command.toJson()}
class RCustomCommandDetail(Resource):
    def get(self, id):
        user = session.get('user', None)
        if not user:
            return {'status':'error', 'message':'请登录'}
        command = CustomCommand.getOne(CustomCommand.id==id)
        if command:
            if command.uid == user.id:
                return {'status':'success', 'result':command.toJson()}
            else:
                return {'status':'error', 'message':'无权限'}
        else:
            return {'status':'error', 'message':'不存在'}
    def put(self, id):
        user = session.get('user', None)
        if not user:
            return {'status':'error', 'message':'请登录'}
        command = CustomCommand.getOne(CustomCommand.id==id)
        if command:
            if command.uid == user.id:
                data = parse_form(request.form, 'status', 'auth', 'name', 'response','description')
                for k in data:
                    setattr(command, k, data[k])
                command.save()
                return {'status':'success', 'result':command.toJson()}
            else:
                return {'status':'error', 'message':'无权限'}
        else:
            return {'status':'error', 'message':'不存在'}
    def delete(self, id):
        user = session.get('user', None)
        if not user:
            return {'status':'error', 'message':'请登录'}
        command = CustomCommand.getOne(CustomCommand.id==id)
        if command:
            if command.uid == user.id:
                data = command.delete_instance()
                return {'status':'success', 'result': data}
            else:
                return {'status':'error', 'message':'无权限'}
        else:
            return {'status':'error', 'message':'不存在'}
        delete_instance
        
class DIndex(Resource):
    def get(self):
        return send_from_directory('static','index.html')

class DJs(Resource):
    def get(self):
        return send_from_directory('static/js','all.js')

class DCss(Resource):
    def get(self):
        return send_from_directory('static/css','all.css')

class NeteaseMusicSearch(Resource):
    def get(self):
        args = request.args
        s = args.get('s', None)
        t = args.get('type', 1)
        offset = args.get('offset', 0)
        total = args.get('total', 'true')
        limit = args.get('limit', 60)
        if not s:
            res = []
        else:
            res = music_api.search(s,t,offset,total,limit)
        return res

class NeteaseMusicDetail(Resource):
    def get(self):
        args = request.args
        s = args.get('id', None)
        if not s:
            res = []
        else:
            res = music_api.song_detail(s)
        return res;
    
api.add_resource(DIndex, '/api/html')
api.add_resource(DJs, '/api/js')
api.add_resource(DCss, '/api/css')
api.add_resource(NeteaseMusicSearch, '/api/music/search')
api.add_resource(NeteaseMusicDetail, '/api/music/detail')

api.add_resource(Login, '/api/login')
api.add_resource(Register, '/api/register')
api.add_resource(RCustomCommand, '/api/customcommand')
api.add_resource(RCustomCommandDetail,'/api/customcommand/<id>')
api.add_resource(Logout, '/api/logout')
api.add_resource(CurrentUser, '/api/currentuser')


@app.route('/')
def index():
    return render_template("index.html") 


